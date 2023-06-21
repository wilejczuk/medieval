import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';
import Loading from '../../loading';
import Upload from '../upload';

import './add-specimen.css';

export default class AddSpecimen extends Component {

  stampsData = new InternalService();

  state = {
    literature: null,
    loading: false
  };

  componentDidMount() {
    this.stampsData.getLiterature()
      .then((body) => {
        this.setState({
          literature: body.data,
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

 sendSpecimen (picture, size, weight, findingSpot, findingSpotComments, poster, publication, idObv, idRev, page, number) {
    this.stampsData.addSpecimen(picture, size, weight, findingSpot, findingSpotComments, poster, publication, idObv, idRev, page, number)
      .then(response => {
        this.setState({
          loading: false
        });
        this.props.onAdded();
      })
      .catch(error => console.log(error));
  }

  render() {
    const {literature, loading} = this.state;
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
         initialValues={{ size: '', weight: '', findingSpot: '', findingSpotComments: '',
           publication: '', page: '', number: '', picture: null, poster: localStorage.getItem("user"),
           idObv: defaultValues[0], idRev: defaultValues[1]}}

         validate={values => {
           const errors = {};
          if (!values.picture) {
            errors.picture = 'required';
          }
           if (!values.page && values.publication!=25) { // 'Unpublished'
             errors.page = 'required';
           }
           if (!values.number && values.publication!=25) { // 'Unpublished'
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
             this.sendSpecimen(values.picture, values.size, values.weight, values.findingSpot,
               values.findingSpotComments, values.poster,
               values.publication, values.idObv, values.idRev, values.page, values.number);
             setSubmitting(false);
           }, 400);
         }}
       >
         {({ isSubmitting, values, setFieldValue }) => (
           <Form className='spec-column' encType="multipart/form-data">
                     <div>
                         <Upload onChange={(file) => {
                              setFieldValue("picture", file);
                            }} />
                         <ErrorMessage className="error-message" name="picture" component="div" />

                         <div className='form-line'>
                            <div className='form-inside'>
                              Size, mm
                            </div>
                            <Field  type="number" name="size" />
                         </div>

                         <div className='form-line'>
                            <div className='form-inside'>
                              Weight, g
                            </div>
                            <Field  type="number" name="weight" />
                          </div>

                          <div className='form-line double-element'>
                             <div className="long-text-caption">
                               Finding spot
                             </div>
                             <Field className='spot' type="text" name="findingSpot" />
                          </div>

                          <div className='form-line double-element'>
                             <div className="long-text-caption">
                               Additional comments
                             </div>
                             <Field component="textarea" className='spot-comments' name="findingSpotComments" />
                          </div>

                          <div>
                            <hr />
                            <b>First publication</b>
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
