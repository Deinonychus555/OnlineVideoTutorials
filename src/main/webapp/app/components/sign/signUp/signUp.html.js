"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpTemplate = " <div id=\"ovt-sign-up\" class=\"animate container\">\n   <div  class=\"ovt-sign ovt-signUp\">        \n            <div class=\"ovt-header\">Registro</div>\n            <div class=\"ovt-container\">\n              \n                <form role=\"form\" [formGroup]=\"signUpForm\" (ngSubmit)=\"doSignUp()\"  novalidate>\n                  <div class=\"ovt-fields\">  \n                        <div class=\"form-group\">\n                            <label for=\"username\">Nombre de usuario</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"userName\" class=\"form-control\" name=\"userName\" type=\"text\" formControlName=\"userName\"\n                                    placeholder=\"Tu nombre de usuario\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.userName.errors && checkFields\">   \n                                    <div *ngIf=\"signUpForm.controls.userName.errors.required\" class=\"alert-danger alert\">El nombre de usuario es requerido</div>\n                                    <div *ngIf=\"signUpForm.controls.userName.errors.minlength\" class=\"alert-danger alert\">El nombre de usuario debe tener como m\u00EDnimo {{signUpForm.controls.userName.errors.minlength.requiredLength}}</div>\n                                    <div *ngIf=\"signUpForm.controls.userName.errors.userNameTaken\" class=\"alert-danger alert\">El nombre de usuario ya existe</div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"name\">Nombre</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"name\" class=\"form-control\" name=\"name\" type=\"text\" formControlName=\"name\" \n                                    placeholder=\"Tu nombre\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.name.errors && checkFields\">       \n                                    <div *ngIf=\"signUpForm.controls.name.errors.required\" class=\"alert-danger alert\">El nombre es requerido</div>\n                                    <div *ngIf=\"signUpForm.controls.name.errors.minlength\" class=\"alert-danger alert\">El nombre debe tener como m\u00EDnimo {{signUpForm.controls.name.errors.minlength.requiredLength}}</div>\n                                </div>\n                            </div>\n                        </div>\n\n                         <div class=\"form-group\">\n                            <label for=\"surname\">Apellidos</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"surname\" class=\"form-control\" name=\"surname\" type=\"text\" formControlName=\"surname\" \n                                    placeholder=\"Tus apellidos\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.surname.errors && checkFields\">       \n                                    <div *ngIf=\"signUpForm.controls.surname.errors.required\" class=\"alert-danger alert\">El apellido es requerido</div>\n                                    <div *ngIf=\"signUpForm.controls.surname.errors.minlength\" class=\"alert-danger alert\">El apellido debe tener como m\u00EDnimo {{signUpForm.controls.surname.errors.minlength.requiredLength}}</div>\n                                </div>    \n                            </div>\n                        </div>\n\n                        <div class=\"form-group\">\n                            <label for=\"email\">Correo</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"email\" class=\"form-control\" name=\"email\" type=\"email\" formControlName=\"email\" \n                                    placeholder=\"Tu direcci\u00F3n de correo electr\u00F3nico\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.email.errors && checkFields\">       \n                                    <div *ngIf=\"signUpForm.controls.email.errors.required\" class=\"alert-danger alert\">La direcci\u00F3n de correo electr\u00F3nico es requerida</div>\n                                    <div *ngIf=\"!signUpForm.controls.email.errors.required && signUpForm.controls.email.errors.emailPattern\" class=\"alert-danger alert\">La direcci\u00F3n de correo electr\u00F3nico no es v\u00E1lida</div>\n                                    <div *ngIf=\"signUpForm.controls.email.errors.emailTaken\" class=\"alert-danger alert\">La direcci\u00F3n de correo electr\u00F3nico ya est\u00E1 asociado a una cuenta</div>\n                                </div>    \n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group\">\n                            <label for=\"password\">Contrase\u00F1a</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"password\" class=\"form-control\" name=\"password\" type=\"password\" formControlName=\"password\" \n                                    placeholder=\"Tu contrase\u00F1a\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.password.errors && checkFields\">       \n                                    <div *ngIf=\"signUpForm.controls.password.errors.required\" class=\"alert-danger alert\">La contrase\u00F1a es requerida</div>\n                                    <div *ngIf=\"signUpForm.controls.password.errors.minlength\" class=\"alert-danger alert\">La contrase\u00F1a debe tener como m\u00EDnimo {{signUpForm.controls.password.errors.minlength.requiredLength}}</div>\n                                </div>    \n                            </div>\n                        </div>\n\n                        <div class=\"form-group\">\n                            <label for=\"confirmationPassword\">Repite la contrase\u00F1a</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"confirmationPassword\" class=\"form-control\" name=\"confirmationPassword\" type=\"password\" formControlName=\"confirmationPassword\" \n                                    placeholder=\"Escribe de nuevo tu contrase\u00F1a\" required>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.errors && checkFields\"> \n                                    <div *ngIf=\"signUpForm.errors.checkPassword\" class=\"alert-danger alert\">Las contrase\u00F1as no coinciden</div> \n                                </div>    \n                            </div>\n                        </div>\n\n                         <div class=\"form-group\">\n                            <label for=\"userType\">Tipo de usuario</label>\n                            <div class=\"ovt-field\">\n                                <input id=\"userTypeTutor\" class=\"form-control ovt-radio\" name=\"userType\" type=\"radio\" formControlName=\"userType\" \n                                    value=\"tutor\" required><span>Tutor</span>\n                                <input id=\"userTypeStudent\" class=\"form-control ovt-radio\" name=\"userType\" type=\"radio\" formControlName=\"userType\" \n                                    value=\"student\" required><span>Student</span>\n                                <div class=\"ovt-display-alert\" *ngIf=\"signUpForm.controls.userType.errors && checkFields\">       \n                                    <div *ngIf=\" signUpForm.controls.userType.errors.required\" class=\"alert-danger alert\">El tipo de usuario es requerido</div>\n                                </div>    \n                            </div>\n                        </div>\n                    </div>   \n                     <div class=\"ovt-submit\" (mouseenter)=\"onGoingToProcess()\">\n                        <input type=\"submit\" name=\"commit\" value=\"Registrarse\" [disabled]=\"!signUpForm.valid\" class=\"btn btn-block btn-info\" ><br>\n                     </div>\n                </form>\n                <button class=\"btn btn-block btn-info\" (click)=\"onReturnToSignIn()\">Volver</button>\n            </div>    \n     </div> \n    \n</div>";
//# sourceMappingURL=signUp.html.js.map