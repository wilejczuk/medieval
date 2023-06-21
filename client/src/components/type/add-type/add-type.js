import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';
import Loading from '../../loading';
import Upload from '../upload';

import './add-type.css';

export default class AddType extends Component {

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

  render() {
    const {literature, loading} = this.state;
    if (!literature) {
      return (
        <h3>Literature is loading.</h3>
      )
    }

    if (loading) return (<Loading />)

    const litOptions = this.renderLitItems(literature);

    const searchParams = this.props.match.params;

    const itemsHeader =
    (<h3>Add one specimen of the type</h3>);

    const styleSides = searchParams['kind'] === 'image' ? { display: "none"} : { display: "flex"};

    return (
          <Formik
             initialValues={{ size: '', weight: '', findingSpot: '', findingSpotComments: '', 
              picture: null, obvStamp: null, revStamp: null, orient: null, poster: localStorage.getItem("user"),
               publication: '', page: '', number: '', obvGroup: searchParams['ot'],
               obvDescription: searchParams['o'], revDescription: searchParams['r'],
               revGroup: searchParams['rt'], obvIndex: searchParams['oi'], revIndex: searchParams['ri']}}

             validate={values => {
               const errors = {};
              if (!values.picture) {
                errors.picture = 'required';
              }
              if (!values.obvStamp) {
                errors.obvStamp = 'required';
              }
              if (!values.revStamp) {
                errors.revStamp = 'required';
              }
               if (!values.page && values.publication!=25) {
                 errors.page = 'required';
               }
               if (!values.number && values.publication!=25) {
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
                  this.stampsData.addTypeAndSpecimen (values.obvGroup, values.revGroup, values.obvIndex,
                    values.revIndex, values.obvStamp, values.revStamp, values.obvDescription,
                    values.revDescription, values.orient, values.picture, values.size, values.weight,
                    values.findingSpot, values.findingSpotComments, values.publication, values.page, values.number,
                    values.poster)
                    .then(response => {
                      const newRoute = `/type/${response.data[0]}/${response.data[1]}`;
                      this.setState({
                        loading: false
                      });
                      window.location.replace(newRoute);
                    })
                    .catch(error => console.log(error));
                 setSubmitting(false);
               }, 400);
             }}
           >
             {({ isSubmitting, values, setFieldValue }) => (
               <Form className="form-add" encType="multipart/form-data">
                 <div className="main-grid">
                   <div className="paddings">
                       <div className="footer-widget-heading">
                          <h3>{searchParams['o']} | stamp</h3>
                          <div style={styleSides}>
                            <Upload onChange={(file) => {
                                setFieldValue("obvStamp", file);
                              }} />
                            <div className="side-orient">  
                                <div role="group" aria-labelledby="my-radio-group">
                                  <span id="my-radio-group">Side orientation</span>
                                  <label>
                                    <Field type="radio" name="orient" value="1" />
                                    <span>↑↑</span>
                                  </label> <br />
                                  <label>
                                    <Field type="radio" name="orient" value="0" />
                                    <span>↑↓</span>
                                  </label>
                                </div>
                              <ErrorMessage className="error-message" name="obvStamp" component="div" />
                            </div>
                          </div>
                       </div> 
                       <div className='form-line'>
                          <Field component="textarea" className='text-area' name="obvDescription" />
                          <ErrorMessage className="error-message" name="obvDescription" component="div" />
                       </div>

                       <div className="paddington"></div>

                       <div className="footer-widget-heading">
                          <h3>{searchParams['r']} | stamp</h3>
                          <div style={styleSides}>
                            <Upload onChange={(file) => {
                                setFieldValue("revStamp", file);
                              }} />
                            <div className="side-orient">  
                              <ErrorMessage className="error-message" name="revStamp" component="div" />
                            </div>  
                          </div>
                       </div>
                       <div className='form-line'>
                          <Field component="textarea" className='text-area' name="revDescription" />
                          <ErrorMessage className="error-message" name="revDescription" component="div" />
                        </div>
                        <br />

                        
                   </div>

                   <div className="footer-widget-heading">
                     {itemsHeader}
                     <div>
                         <Upload onChange={(file, left, right) => {
                              setFieldValue("picture", file);
                              if (searchParams['kind'] === 'image') {
                                setFieldValue("obvStamp", left);
                                setFieldValue("revStamp", right);
                              }
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
                       </div>
                     </div>
                 </Form>
               )}
           </Formik>
    )
  }
}
