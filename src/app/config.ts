export class Config {

  // API url
  static get api(): string { return 'http://zssn-backend-example.herokuapp.com/api/' };

  // google maps
  static get gmaps_key(): string { return 'AIzaSyDEdVkgms32J_TZad9VJO-XJHWvaQRUDqg' };
  static get gmaps_timeout(): number { return 70000 };
  static get gmaps_accuracy(): boolean { return true };
  static get gmaps_sensor(): string { return '' }; // '&sensor=true'

  // PEOPLE
  static get api_people(): string { return `${Config.api}people` };

}
