import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm!: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  /**
   * Importante añadir el forbiddenNames.bind(this). Esto se debe a que 
   * este validador no se llamará desde esta clase y por tanto 'this' se
   * referirá a otro objeto. Con bind nos aseguramos de que se refiera a
   * esta clase
   */
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email' : new FormControl(null, {
          validators: [Validators.required, Validators.email], 
          }) //asyncValidators: this.forbiddenEmails
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });

    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // )
    // this.signupForm.statusChanges.subscribe(
    //   (value) => console.log(value)
    // )
    this.signupForm.setValue({
      'userData': {
        'username': 'Gabriel',
        'email': 'gabi@email.com'
      },
      'gender': 'male',
      'hobbies': []
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  // Importante castear el array como FormArray
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  /**
   * Así se configura un validador propio. Debe recibir un FormControl y
   * debe devolver un JSON con una key de tipo string y un value de tipo
   * boolean. 
   */
  forbiddenNames(control: FormControl): {[s: string]: boolean} | null {
    /**
     * Importante que la condición esté formulada así '!== -1', porque de
     * esa forma se devuelve un boolean. Sin esa parte se devolvería un -1
     * cuando no se encuentre el valor en el array, lo cuál sería interpretado
     * como true por JS
     */
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden' : true};
    }
    /**
     * Importante que si no se cumple la condición, el validador devuelva
     * o null o nada en absoluto, nunca 'nameIsForbidden': false, Angular
     * no lo reconocería como validador
     */
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> | null {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500)
    });
    return promise;
  }

  get arrayControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }
}
