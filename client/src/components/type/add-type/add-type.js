import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';

import './add-type.css';

export default class AddType extends Component {

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

  render() {
    const {literature} = this.state;
    if (!literature) {
      return (
        <h3>Literature is loading.</h3>
      )
    }
    const litOptions = this.renderLitItems(literature);

    const searchParams = this.props.match.params;
    console.log(searchParams);

    const itemsHeader =
    (<div><h5>Add one specimen of the type</h5></div>);

    const panelClass = "items-pad";

    return (
          <Formik
             initialValues={{ size: '', weight: '', findingSpot: '', findingSpotComments: '',
               publication: '', page: '', number: '', obvGroup: searchParams['ot'],
               obvDescription: searchParams['o'], revDescription: searchParams['r'],
               revGroup: searchParams['rt'], obvIndex: searchParams['oi'], revIndex: searchParams['ri']}}

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
                  this.stampsData.addTypeAndSpecimen (values.obvGroup, values.revGroup, values.obvIndex,
                    values.revIndex, values.obvStamp, values.revStamp, values.obvDescription,
                    values.revDescription, values.orient, values.picture, values.size, values.weight,
                    values.findingSpot, values.findingSpotComments, values.publication, values.page, values.number)
                    .then(response => {
                      console.log(response);

                      const newRoute = `/type/${response.data[0]}/${response.data[1]}`;
                      //window.location.replace(newRoute);
                    })
                    .catch(error => console.log(error));
                 setSubmitting(false);
               }, 400);
             }}
           >
             {({ isSubmitting, setFieldValue }) => (
               <Form className="form-add" encType="multipart/form-data">
                 <div className="main-grid">
                   <div className="paddings">
                       <div className='double-element'>
                          <h5>{searchParams['o']} | stamp drawing</h5>
                          <input className='paddington' required id="obvStamp" name="obvStamp" type="file"
                            accept="image/png, image/jpeg" onChange={(event) => {
                            setFieldValue("obvStamp", event.currentTarget.files[0]);
                          }} />
                       </div>
                       <div className='form-line'>
                          <Field component="textarea" className='text-area' name="obvDescription" />
                          <ErrorMessage className="error-message" name="obvDescription" component="div" />
                       </div>

                       <div className="paddington"></div>

                       <div className='double-element'>
                          <h5>{searchParams['r']} | stamp drawing</h5>
                          <input className='paddington' required id="revStamp" name="revStamp" type="file"
                            accept="image/png, image/jpeg" onChange={(event) => {
                            setFieldValue("revStamp", event.currentTarget.files[0]);
                          }} />
                       </div>
                       <div className='form-line'>
                          <Field component="textarea" className='text-area' name="revDescription" />
                          <ErrorMessage className="error-message" name="revDescription" component="div" />
                        </div>
                        <br />

                        <div role="group" aria-labelledby="my-radio-group">
                          <span className="side-orient" id="my-radio-group">Side orientation</span>
                          <label className="side-orient">
                            <Field type="radio" name="orient" value="↑↑" />
                             ↑↑
                          </label>
                          <label className="side-orient">
                            <Field type="radio" name="orient" value="↑↓" />
                            ↑↓
                          </label>
                        </div>
                   </div>

                   <div>
                     {itemsHeader}
                     <div className={panelClass}>
                         <div className='form-line double-element'>
                            <div>
                              Picture
                            </div>
                            <input required id="picture" name="picture" type="file"
                              accept="image/png, image/jpeg" onChange={(event) => {
                              setFieldValue("picture", event.currentTarget.files[0]);
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
                         </div>
                       </div>
                     </div>
                 </Form>
               )}
           </Formik>
    )
  }
}
