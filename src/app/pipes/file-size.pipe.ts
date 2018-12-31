import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!value){
      return null;
    }

    var result;

    if (Math.floor(value / 1024) == 0){
      result = value + 'B';
    }
    else if (Math.floor(value / Math.pow(1024, 2)) == 0){
      result = Math.round(value / 1024) + 'KB';
    }
    else if (Math.floor(value / Math.pow(1024, 3)) == 0){
      result = Math.round(value / Math.pow(1024, 2)) + 'MB';
    }
    
    return result;
  }

}
