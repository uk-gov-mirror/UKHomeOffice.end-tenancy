
describe('Send Email Behaviour', () => {
  const mockData = '<html></html>';

  describe('sendEmail', () => {
    let sendEmailStub;
    let prepareUploadStub;
    let notifyClientMock;
    let fsMock;
    let pdfUploadMock;
    let saveStub;
    let req;
    let res;
    let instance;
    let cbStub;
    let bufferData;

    const configMock = {
      notify: {
        apiKey: 'mock-api-key',
        caseworkerEmail: 'mock-case-worker@example.org',
        templateCaseworker: 'template-caseworker',
        templateCustomer: 'template-customer'
      }
    };

    beforeEach(() => {
      bufferData = Buffer.from(mockData);
      cbStub = sinon.stub();
      req = request();
      res = response();
      saveStub = sinon.stub();

      saveStub.withArgs(req, res, 'superLocals')
        .resolves({ pdfData: bufferData, fvLink: 'test-link' });

      pdfUploadMock = sinon.stub().returns({ save: saveStub });
      sendEmailStub = sinon.stub().resolves();
      prepareUploadStub = sinon.stub().returns({
        file: 'base64-file',
        is_csv: false
      });

      fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData)),
        unlink: sinon.stub().callsFake((p, cb) => cb(null))
      };

      notifyClientMock = {
        NotifyClient: class {
          constructor() {
            this.prepareUpload = prepareUploadStub;
            this.sendEmail = sendEmailStub;

            return this;
          }
        }
      };

      class Base {
        locals() {
          return 'superLocals';
        }
      }

      const Behaviour = proxyquire('../apps/end-tenancy/behaviours/send-email', {
        fs: fsMock,
        '../../../lib/utils': notifyClientMock,
        '../../../config': configMock,
        '../models/upload-pdf': pdfUploadMock
      });

      const SendEmail = Behaviour(Base);

      instance = new SendEmail();

      req.sessionModel.set('what', 'Renew Application');
      req.sessionModel.set('agent-email-address', 'agent@email.com');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should called prepareUpload once', async () => {
      await instance.successHandler(req, res, cbStub);
      prepareUploadStub.withArgs(bufferData).should.be.calledOnce;
    });

    it('should send one email to a caseworker with the correct info', async () => {
      await instance.successHandler(req, res, cbStub);

      const expectedCaseworkerEmailContent = {
        personalisation: {
          'form id': 'test-link',
          title: 'A Renew Application has been sent'
        }
      };

      expect(sendEmailStub.firstCall.args).to.eql([
        configMock.notify.templateCaseworker,
        configMock.notify.caseworkerEmail,
        expectedCaseworkerEmailContent
      ]);
    });

    it('should send one email to an agent with the correct info', async () => {
      await instance.successHandler(req, res, cbStub);

      const expectedCaseworkerEmailContent = {
        personalisation: {
          'form id': {
            file: 'base64-file',
            is_csv: false
          },
          title: 'Your Renew Application has been sent'
        }
      };

      expect(sendEmailStub.secondCall.args).to.eql([
        configMock.notify.templateCustomer,
        'agent@email.com',
        expectedCaseworkerEmailContent
      ]);
    });

    it('should send one email to a landlord with the correct info', async () => {
      req.sessionModel.set('landlord-email-address', 'landlord@email.com');

      await instance.successHandler(req, res, cbStub);

      const expectedCaseworkerEmailContent = {
        personalisation: {
          'form id': {
            file: 'base64-file',
            is_csv: false
          },
          title: 'Your Renew Application has been sent'
        }
      };

      expect(sendEmailStub.secondCall.args).to.eql([
        configMock.notify.templateCustomer,
        'landlord@email.com',
        expectedCaseworkerEmailContent
      ]);
    });

    it('should call the callback with an error if there is an email issue to the caseworker', async () => {
      sendEmailStub.rejects();
      await instance.successHandler(req, res, cbStub);

      sendEmailStub.should.have.been.calledOnce;
      cbStub.should.have.been.calledOnce;
      cbStub.firstCall.args[0].should.be.instanceOf(Error);
    });

    it('should call the callback with an error if there is an email issue to the customer', async () => {
      sendEmailStub.onSecondCall().rejects();
      await instance.successHandler(req, res, cbStub);

      sendEmailStub.should.have.been.calledTwice;
      cbStub.should.have.been.calledOnce;
      cbStub.firstCall.args[0].should.be.instanceOf(Error);
    });
  });
});
