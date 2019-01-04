import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'excludeUser'
})
export class ExcludeUserPipe implements PipeTransform {

  transform(users: User[], userToExcludeId: number): any {

    if (!users){
      return null;
    }
    if (!userToExcludeId){
      throw new Error('The parameter "userToExcludeId" must be specified!');
    }

    return users.filter(x => x.id !== userToExcludeId);
  }

}
