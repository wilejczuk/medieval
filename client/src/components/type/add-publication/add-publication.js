import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';
import Loading from '../../loading';

import './add-publication.css';
import { getCookie } from '../../../helpers/cookie';

export default class AddPublication extends Component {

  stampsData = new InternalService();

  state = {
    literature: null,
    defaultPublication: '',
    loading: false
  };

  componentDidMount() {
    this.stampsData.getLiterature()
      .then((body) => {
        this.setState({
          literature: body.data,
          defaultPublication: getCookie('selectedPublication')??''
        });
      });
  }

  renderLitItems(arr) {
    return arr.map(({id, name, year}) => {
      const uniqueKey = `lit${id}`;
      const longName = name.includes(', Unpublished,') ? 'Unpublished' : `${year} | ${name}`;
      return (
        <option key={uniqueKey} value={id}>{longName}</option>
      );
    })
  }

 sendPublication (publication, page, number, idSpecimen) {
    this.stampsData.addPublication(publication, page, number, idSpecimen)
      .then(response => {
        this.setState({
          loading: false
        });
        this.props.onAdded();
      })
      .catch(error => console.log(error));
  }

  render() {
    const {literature, loading, defaultPublication} = this.state;
    if (!literature) {
      return (
        <h3>Literature is loading.</h3>
      )
    }

    if (loading) return (<Loading />)

    const litOptions = this.renderLitItems(literature);
    const {defaultValues} = this.props;

    return (
      <Formik
         initialValues={{ publication: defaultPublication, page: '', number: '', idSpecimen: defaultValues[0]}}

         validate={values => {
           const errors = {};
           if (!values.page) { 
              errors.page = 'required';
           }
           if (!values.number) {
              errors.number = 'required';
           }
           if (!values.publication) {
              errors.publication = 'required';
           }
           return errors;
         }}
         onSubmit={(values, { setSubmitting }) => {
           this.setState({
             loading: true
           });
           setTimeout(() => {
             this.sendPublication(values.publication, values.page, values.number, values.idSpecimen);
             setSubmitting(false);
           }, 400);
         }}
       >
         {({ isSubmitting, values, setFieldValue }) => (
           <Form encType="multipart/form-data">
                    <div>
                          <div>
                            <hr />
                            <span className="greyish right_side"><a onClick={this.props.onAdded} title="Cancel">x</a></span>
                            <b>Publication</b>
                            <div>
                                <ErrorMessage className="error-message" name="publication" component="div" />
                              </div>
                          </div>

                          <div className='form-line double-element'>
                              <Field as="select" name="publication" className="publication">
                                  <option key="defOption" ></option>
                                  {litOptions}
                              </Field>
                          </div>

                          <div className='form-line'>
                             <div className='form-inside'>
                               Page
                               <ErrorMessage className="error-message" name="page" component="div" />
                             </div>
                             <Field type="number" name="page" disabled={values.publication == 25} /> 
                          </div>

                          <div className='form-line'>
                             <div className='form-inside'>
                               Number
                               <ErrorMessage className="error-message" name="number" component="div" />
                             </div>
                             <Field type="text" name="number" disabled={values.publication == 25} />
                          </div>

                          <div className="sub-call-to-action">
                          <hr />
                            <button className="button-two" type="submit" disabled={isSubmitting}><span>Save to the database!</span></button>
                          </div> 
                    </div>
           </Form>
         )}
       </Formik>
    )
  }
}
