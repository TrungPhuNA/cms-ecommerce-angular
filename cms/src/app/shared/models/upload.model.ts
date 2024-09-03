export class FileUploadModel {
  public fileInfo: File | null = null;
  public imgBase64: string | ArrayBuffer | null = null;
  public fileOld: boolean = true;
  public imgLink: string|any;
  public index?: number;
  public id?: number;
  public imageMeta?: ImageMeta;
  public imgSize?: any;
  public isValid?: any = true;

  constructor(fileInfo: File | null, imgBase64: string | ArrayBuffer | null, fileOld: boolean, imgLink: string, index?: number, id?: number, imageMeta?: ImageMeta) {
    this.fileInfo = fileInfo;
    this.imgBase64 = imgBase64;
    this.fileOld = fileOld;
    this.imgLink = imgLink;
    this.index = index;
    this.id = id;
    this.imageMeta = imageMeta;
  }
}

export interface ImageMeta {
  width: number;
  height: number;
  ratio: number;
}
