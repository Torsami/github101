import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import db from '../src/db/db';
import superagent from 'superagent';
import {signUpUser, logInCreatedUser} from './createUser';

const cagent = superagent.agent()
const should = chai.should();
const expect = chai.expect();
const url = '/api/v1/questions';
const data = {
questions: 'What is the Test questions?'
} ;

chai.use(chaiHttp);

const api =  chai.request('http://localhost:5000');


describe('Endpoint 3: Add A Questions', () => {
  it('Signup-User', (done) => {
    return signUpUser()
            .then((result) => result.JSON())
            .then((data) => {
              expect(data.success).to.equal('true');
            })
      .finally(done())
   });

   it('LogInCreatedUser', (done) => {
    return logInCreatedUser()
        .then((result) => result.JSON())
        .then((data) => {
          expect(data.success).to.equal('true');

          it('Should Have Access', (done) => {
            api.post(url)
               .send(data)
               .cagent.attachCookies( req )
               .end((err, res) => {
                 res.should.have.status(201);
               done();
             })
           });
         
           it('Should Check Type of Response Received', (done) => {
            api.post(url)
               .send(data)
               .cagent.attachCookies( req )
               .end(function(err, res){
                 res.body.should.be.a('object');
               done();
               });
           });
         
           it('Should Check Properties of Response Received Upon Access', (done) => {
            api.post(url)
               .send(data)
               .cagent.attachCookies( req )
               .end((err, res) => {
                 res.body.question.should.have.property('id').eql(5);
                 res.body.question.should.have.property('time');
                 res.body.question.should.have.property('question');
                 res.body.question.should.have.property('answers');
                 res.body.question.answers.should.be.a('array');
               done();
               });
           });
        })
        .finally(done());
  })
  
  


});


