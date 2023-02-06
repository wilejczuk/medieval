import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';

import './add-specimen.css';

export default class AddSpecimen extends Component {

  stampsData = new InternalService();

  state = {
    literature: null
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
      const longName = `${year} | ${name}`;
      return (
        <option key={uniqueKey} value={id}>{longName}</option>
      );
    })
  }

 sendSpecimen (picture, size, weight, findingSpot, findingSpotComments, publication, idObv, idRev, page, number) {
    this.stampsData.addSpecimen(picture, size, weight, findingSpot, findingSpotComments, publication, idObv, idRev, page, number)
      .then(response => {
console.log (response);
        this.props.onAdded();
      })
      .catch(error => console.log(error));
  }

  render() {
    const {literature} = this.state;
    if (!literature) {
      return (
        <h3>Literature is loading.</h3>
      )
    }

    const litOptions = this.renderLitItems(literature);
    const {defaultValues} = this.props;

    return (
      <Formik
         initialValues={{ size: '', weight: '', findingSpot: '', findingSpotComments: '',
           publication: '', page: '', number: '',
           idObv: defaultValues[0], idRev: defaultValues[1]}}

         validate={values => {
           const errors = {};
           /*
           if (!values.size) {
             errors.size = 'required';
           }
           if (!values.weight) {
             errors.weight = 'required';
           }
           */
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
           setTimeout(() => {
             this.sendSpecimen(values.file, values.size, values.weight, values.findingSpot,
               values.findingSpotComments,
               values.publication, values.idObv, values.idRev, values.page, values.number);
             setSubmitting(false);
           }, 400);
         }}
       >
         {({ isSubmitting, setFieldValue }) => (
           <Form className="form-add" encType="multipart/form-data">
             <div className='form-line double-element'>
                <div>
                  Picture
                </div>
                <input required id="file" name="file" type="file"
                  accept="image/png, image/jpeg" onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }} />
             </div>

             <div className='form-line'>
                <div className='form-inside'>
                  Size, mm
                  <ErrorMessage className="error-message" name="size" component="div" />
                </div>
                <Field className='number-field' type="number" name="size" />
             </div>

             <div className='form-line'>
                <div className='form-inside'>
                  Weight, g
                  <ErrorMessage className="error-message" name="weight" component="div" />
                </div>
                <Field className='number-field' type="number" name="weight" />
              </div>

              <div className='form-line double-element'>
                 <div>
                   Finding spot
                   <ErrorMessage className="error-message" name="findingSpot" component="div" />
                 </div>
                 <Field className="long-text" type="text" name="findingSpot" />
              </div>

              <div className='form-line double-element'>
                 <div>
                   Additional comments
                   <ErrorMessage className="error-message" name="findingSpotComments" component="div" />
                 </div>
                 <Field className="long-text" type="text" name="findingSpotComments" />
              </div>

              <div>
                <hr />
                <b>First publication</b>
              </div>

              <div className='form-line double-element'>
                  <div>
                    <ErrorMessage className="error-message" name="publication" component="div" />
                  </div>
                  <Field as="select" name="publication" className="long-text">
                      <option key="defOption" ></option>
                      {litOptions}
                  </Field>
              </div>

              <div className='form-line'>
                 <div className='form-inside'>
                   Page
                   <ErrorMessage className="error-message" name="page" component="div" />
                 </div>
                 <Field type="number" name="page" />
              </div>

              <div className='form-line'>
                 <div className='form-inside'>
                  Number
                   <ErrorMessage className="error-message" name="number" component="div" />
                 </div>
                 <Field type="text" name="number" />
               </div>

             <button type="submit" disabled={isSubmitting}>
               Submit
             </button>
           </Form>
         )}
       </Formik>
    )
  }
}
