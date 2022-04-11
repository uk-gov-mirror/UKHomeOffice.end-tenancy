'use strict';

const Behaviour = require('../../../apps/end-tenancy/behaviours/set-confirm-step');

describe('apps/behaviours/set-confirm-step', () => {
  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  class Base {
    getNextStep() {}
  }
  let req;
  let res;
  let instance;
  const next = 'foo';

  beforeEach(() => {
    req = request();
    res = response();
    sinon.stub(Base.prototype, 'getNextStep').returns(next);
    instance = new (Behaviour(Base))();
  });

  afterEach(() => {
    Base.prototype.getNextStep.restore();
  });

  describe('getNextStep', () => {
    it('always calls super.getNextStep', () => {
      instance.getNextStep(req, res);
      expect(Base.prototype.getNextStep).to.have.been.called;
    });

    it('returns the next step', () => {
      const step = instance.getNextStep(req, res);
      expect(next).to.equal('foo');
      expect(step).to.equal(next);
    });

    it('sets `confirmStep` to `/confirm` when `what` is `request`', () => {
      req.sessionModel.set('what', 'request');
      instance.getNextStep(req, res);
      expect(instance.confirmStep).to.equal('/confirm');
    });


    it('sets `confirmStep` to `/confirm-declaration` when `what` is not `request`', () => {
      req.sessionModel.set('what', 'foo');
      instance.getNextStep(req, res);
      expect(instance.confirmStep).to.equal('/confirm-declaration');
    });
  });
});
