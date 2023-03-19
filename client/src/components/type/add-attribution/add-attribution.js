import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../../services/internal-api';
import Loading from '../../loading';

import './add-attribution.css';

export default class AddAttribution extends Component {

  stampsData = new InternalService();

  state = {
    literature: null,
    dukes: null,
    loading: false
  };

  componentDidMount() {
    this.stampsData.getLiterature()
      .then((body) => {
        this.setState({
          literature: body.data,
        });
      });

    this.stampsData.getDukesEnum()
      .then((body) => {
        console.log (body.data)
        this.setState({
          dukes: body.data,
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

  renderPersonaliaItems(arr) {
    return arr.map(({id,
      name,
      dateBirth,
      dateDeath,
      datePower,
      birthProximity,
      powerProximity,
      deathProximity
    }) => {
      const birth = dateBirth ? `${birthProximity?'≈':''}${dateBirth} ` : '';
      const power = datePower ? `ϡ ${powerProximity?'≈':''}${datePower} ` : '';
      const death = dateDeath ? `† ${deathProximity?'≈':''}${dateDeath}` : '';
      const dates = `${birth}${power}${death}`;
      const title = (dates === '') ? `${name}` : `${name} (${dates})`;
      const uniqueKey = `duke${id}`;
      return (
        <option key={uniqueKey} value={id}>{title}</option>
      );
    })
  }

 sendAttribution (idPersona, idPublication, idObv, page) {
    this.stampsData.addAttribution(idPersona, idPublication, idObv, page)
      .then(response => {
        this.setState({
          loading: false
        });
        this.props.onAdded();
      })
      .catch(error => console.log(error));
  }

  render() {
    const {literature, dukes, loading} = this.state;
    if (!literature || !dukes) {
      return (
        <h3>Data is loading.</h3>
      )
    }

    if (loading) return (<Loading />);

    const litOptions = this.renderLitItems(literature);
    const personOptions = this.renderPersonaliaItems(dukes);
    const {defaultValues} = this.props;

    return (
      <Formik
         initialValues={{ persona: '',
           publication: '', page: '', idObv: defaultValues[0]}}

         validate={values => {
           const errors = {};
           if (!values.page) {
             errors.page = 'required';
           }
           if (!values.publication) {
             errors.publication = 'required';
           }
           if (!values.persona) {
            errors.persona = 'required';
           }
           return errors;
         }}
         onSubmit={(values, { setSubmitting }) => {
           this.setState({
             loading: true
           });
           setTimeout(() => {
             this.sendAttribution(values.persona,
             values.publication, values.idObv, values.page);
             setSubmitting(false);
           }, 400);
         }}
       >
         {({ isSubmitting, setFieldValue }) => (
           <Form className="form-add" encType="multipart/form-data">
              
              <div className='form-line double-element'>
                  <div>
                    <ErrorMessage className="error-message" name="persona" component="div" />
                  </div>
                  <Field as="select" name="persona" className="long-text">
                      <option key="defOptionPersona" ></option>
                      {personOptions}
                  </Field>
              </div>

              <div>
                <hr />
                <b>Attributed in</b>
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

             <button type="submit" disabled={isSubmitting}>
               Submit
             </button>
           </Form>
         )}
       </Formik>
    )
  }
}
