import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import InternalService from '../../services/internal-api';
import Loading from '../loading';

import './attribute.css';

export default class Attribute extends Component {

  stampsData = new InternalService();

  state = {
    loading: false,
    sent: false
  };

  componentDidMount() {
    document.title = `Seals of Ancient Rus' - Атрибуция артефактов`;
    this.setState({
      loading: false,
      sent: false
    })
  }

  render() {
    const {loading, sent} = this.state;
    if (loading) return (<Loading />);
    if (sent) return (
      <div>
        <h6>Спасибо за послание, мы Вам обязательно ответим</h6>
        <div><a href="/attribute">Отправить еще один предмет на определение</a></div>
      </div>
    );

    const itemsHeader =
    (<div><h5>Add one specimen of the type</h5></div>);

    const panelClass = "items-pad";

    return (
          <Formik
             initialValues={{ obverse: '', reverse: '', email: '', description: '' }}

             validate={values => {
               const errors = {};
               if (!values.obverse) {
                 errors.obverse = 'Required';
               }
               if (!values.reverse) {
                 errors.reverse = 'Required';
               }
               if (!values.description) {
                 errors.description = 'Required';
               }
               if (!values.email) {
                errors.email = 'Required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }
               return errors;
             }}
             onSubmit={(values, { setSubmitting }) => {
               this.setState({
                 loading: true
               });
               setTimeout(() => {
                  this.stampsData.sendEmail (values.email, values.obverse, values.reverse, values.description)
                    .then(response => {
                      this.setState({
                        loading: false,
                        sent: true
                      });
                    })
                    .catch(error => console.log(error));
                 setSubmitting(false);
               }, 400);
             }}
           >
             {({ isSubmitting, setFieldValue }) => (
              <Form encType="multipart/form-data">
                 <div className="main-grid">
                   <div className="paddings">
                      <div className='double-element'>
                        <h5>Фото аверса</h5>
                        <input className='paddington' required id="obverse" name="obverse" type="file"
                          accept="image/png, image/jpeg" onChange={(event) => {
                          setFieldValue("obverse", event.currentTarget.files[0]);
                        }} />
                      </div>

                      <br />

                      <div className='double-element'>
                        <h5>Фото реверса</h5>
                        <input className='paddington' required id="reverse" name="reverse" type="file"
                          accept="image/png, image/jpeg" onChange={(event) => {
                          setFieldValue("reverse", event.currentTarget.files[0]);
                        }} />
                      </div>

                      <br />

                      <div >
                        <h6>Ваш адрес электронной почты</h6> 
                        <Field type="email" name="email" />
                        <ErrorMessage className="error-message" name="email" component="div" />
                      </div>  

                      <br />
                      
                      <div>
                          <h6>Сведения о месте находки и Ваше послание нам</h6>
                          <Field component="textarea" className='text-area' name="description" />
                          <ErrorMessage className="error-message" name="description" component="div" />
                      </div>

                      <button type="submit" disabled={isSubmitting}>
                          Отправить
                      </button>
                    </div>
                    <div className="paddings"> 
                      Уважаемый посетитель,<br />
                      Если Вам нужно определить печать или пломбу периода Киевской Руси, пожалуйста, заполните форму справа.<br /><br />
                      <h5> Рекомендации </h5>
                      <ul>
                        <li>Присоединяйте фотографии или сканы каждой стороны отдельно, четкие, без бликов и больших участков фона.</li>
                        <li>Укажите данные о месте обнаружения настолько детально, насколько это Вам комфортно. Для сфрагистических памятников район находки часто дает ключевую подсказку для правильной атрибуции.</li>
                      </ul>  
                      <br /><br />
                      Мы Вам обязательно ответим.  
                    </div>
                  </div>

              </Form>
               )}
           </Formik>
    )
  }
}
