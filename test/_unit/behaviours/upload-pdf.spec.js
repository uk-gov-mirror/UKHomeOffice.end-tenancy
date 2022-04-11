
describe('Upload PDF Behaviour', () => {
  const mockData = '<html></html>';

  const getProxyquiredInstance = (overrides, behaviourConfig) => {
    overrides['../../end-tenancy/translations/src/en/pages.json'] =
      overrides['../../end-tenancy/translations/src/en/pages.json'] ||
      { confirm: { sections: {} }, '@noCallThru': true };

    const Behaviour = proxyquire('../apps/end-tenancy/models/upload-pdf', overrides);

    const defaults =
      {
        sessionModelNameKey: 'fullName',
        sortSections: true
      };

    Object.assign(defaults, behaviourConfig);

    return new Behaviour(defaults);
  };

  const orderedSections = {
    confirm: {
      sections: {
        'key-details': {
          header: 'Key details'
        },
        'tenants-left': {
          header: 'Notice requested for'
        }
      }
    },
    '@noCallThru': true
  };

  const inputRows = [
    {
      section: 'Notice requested for',
      fields: [
        {
          label: 'Have you ever been convicted of a crime in the UK?'
        }
      ]
    },
    {
      section: 'Key details'
    }
  ];

  const mockLocals = {
    fields: [],
    route: 'confirm',
    baseUrl: '/',
    title: 'Check your answers',
    intro: null,
    nextPage: '/complete',
    feedbackUrl: '/feedback?f_t=eyJiYXNlVXJsIjoiL2FwcGx5IiwicGF0aCI6Ii9jb25maXJtIiwidXJsIjoiL2FwcGx5L2N' +
      'vbmZpcm0ifQ%3D%3D',
    rows: inputRows
  };

  const expectedRows = [
    {
      section: 'Key details'
    },
    {
      section: 'Notice requested for',
      fields: [
        {
          label: 'Have you ever been convicted of a crime in the UK?'
        }
      ]
    }
  ];

  describe('#renderHtml', () => {
    let fsMock;

    beforeEach(() => {
      fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should send the correct locals and ordered rows to renderHTML', async () => {
      const req = request({ form: { options: {} }, session: {} });
      const res = response({});
      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      }
      );

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../end-tenancy/translations/src/en/pages.json': orderedSections
      });

      await instance.renderHTML(req, res, mockLocals);

      res.render.should.be.calledOnce;
      res.render.withArgs('pdf.html', sinon.match.object).should.be.calledOnce;

      const actualLocals = res.render.firstCall.args[1];
      actualLocals.rows.should.eql(expectedRows);
      actualLocals.htmlLang.should.eql('en');
      actualLocals.title.should.eql('Check your answers');
    });

    it('should call sortSections when sortSections is true ', async () => {
      const req = request({ form: { options: {} }, session: {} });

      const res = response({});

      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      });

      const instance = getProxyquiredInstance({ fs: fsMock });
      instance.sortSections = sinon.stub().callsFake((...args) => args);

      await instance.renderHTML(req, res, () => ({ rows: [] }));

      instance.sortSections.should.be.calledOnce;
    });

    it('should not call sortSections when sortSections is false ', async () => {
      const req = request({ form: { options: {} }, session: {} });

      const res = response({});

      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      });

      const instance = getProxyquiredInstance({ fs: fsMock }, {sortSections: false});
      instance.sortSections = sinon.stub().callsFake((...args) => args);

      await instance.renderHTML(req, res, () => ({ rows: [] }));

      instance.sortSections.should.not.be.calledOnce;
    });

    it('should reject on render error', async () => {
      const req = request({ form: { options: {} }, session: {} });
      const res = response({});
      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(Error('Error'), null);
      });

      const localsStub = sinon.stub().returns({});
      const instance = getProxyquiredInstance({ fs: fsMock });

      await instance.renderHTML(req, res, localsStub).should.be.rejected;
    });
  });

  describe('#save', () => {
    let fsMock;
    let instance;
    let pdfConverterStub;
    let fileVaultStub;
    let pdfSetStub;
    let pdfSaveStub;
    let fvSetStub;
    let fvSaveStub;
    let req;
    let res;

    beforeEach(() => {
      fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };
      req = request();
      res = response();
      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, 'html-data');
      });
      pdfSetStub = sinon.stub();
      pdfSaveStub = sinon.stub().resolves('pdf-data');
      fvSetStub = sinon.stub();
      fvSaveStub = sinon.stub().resolves({ url: 'fv-url' });

      pdfConverterStub = sinon.stub().returns({ set: pdfSetStub, save: pdfSaveStub });
      fileVaultStub = sinon.stub().returns({ set: fvSetStub, save: fvSaveStub });

      instance = getProxyquiredInstance({
        hof: { apis: { pdfConverter: pdfConverterStub } },
        '../../../lib/utils': {
          FileVaultModel: fileVaultStub
        },
        fs: fsMock,
        '../../end-tenancy/translations/src/en/pages.json': orderedSections
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should call the pdf uploader with html data and save it', async () => {
      await instance.save(req, res, mockLocals);

      pdfConverterStub.should.have.been.calledOnce;
      pdfSetStub.should.have.been.calledOnce.calledWithExactly({ template: 'html-data' });
      pdfSaveStub.should.have.been.calledOnce;
    });

    it('should upload the pdf data to filevault', async () => {
      await instance.save(req, res, mockLocals);

      fileVaultStub.should.have.been.calledOnce;
      fvSetStub.should.have.been.calledOnce.calledWithExactly({
        name: 'application_form.pdf',
        data: 'pdf-data',
        mimetype: 'application/pdf'
      });
      fvSaveStub.should.have.been.calledOnce;
    });

    it('should return the pdf data and file vault url', async () => {
      const result = await instance.save(req, res, mockLocals);

      expect(result).to.eql({ pdfData: 'pdf-data', fvLink: 'fv-url' });
    });

    it('should throw an error if there is an issue with uploading the pdf', () => {
      pdfSaveStub.rejects();
      return instance.save(req, res, mockLocals)
        .catch(err => {
          fvSaveStub.should.not.have.been.called;
          err.should.be.instanceOf(Error);
        });
    });

    it('should throw an error if there is an issue with saving to filevault', () => {
      fvSaveStub.rejects();
      return instance.save(req, res, mockLocals)
        .catch(err => {
          pdfSaveStub.should.have.been.calledOnce;
          err.should.be.instanceOf(Error);
        });
    });
  });
});
