import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlertService, HelperService } from "../../../services";
import { FileUploadModel } from "../../models";
import { Helpers } from "../../helpers/helpers";
import { NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";

@Component( {
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
} )
export class UploadImageComponent implements OnInit, OnChanges {

  //FOR MULTIPLE IMAGES WITH INFO
  @Input() maxItem: number = 50;
  @Input() minItem: number;
  @Input() imageWH: string = '20vmin';
  @Input() imageHeight: string;
  @Input() imageWidth: string;
  @Input() isRequired: boolean = false;
  @Input() imageRatio: string;
  @Input() imageFiles: FileUploadModel[] = [];
  @Input() requiredMessage: string = 'Image is required';
  @Input() class: string = '';
  @Input() maxSize: number;
  @Input() disable: boolean;
  @Input() applyRole: boolean;
  @Output() imagesToUpload = new EventEmitter<FileUploadModel[]>();
  @Output() itemsToRemove = new EventEmitter<number>();
  @Output() imagesInvalid = new EventEmitter<boolean>();
  @Output() actionDelete = new EventEmitter<boolean>();

  loading = false;
  totalImgSize: number = 0;
  noteLabel: string = "Dung lượng ảnh:"
  isWrongRatio: boolean = false;
  requiredRatio: {
    width: number,
    height: number
  };
  ratioNumber: number;
  showAddNewImage: boolean = true;

  constructor(
    private alertService: AlertService,
    public  helperService: HelperService,
    public detectors: ChangeDetectorRef,
    public helpers: Helpers,
    private tooltipConfig: NgbTooltipConfig,
  ) {
    tooltipConfig.placement = 'bottom-end';
    tooltipConfig.triggers = 'hover';
    tooltipConfig.container = 'images-content';
    tooltipConfig.tooltipClass = 'tooltip-custom';
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.imageFiles) {
        this.checkConditionAddNewImage();
      }

  }

  checkConditionAddNewImage() {
    if (this.disable && this.imageFiles.length === 0) {
      this.showAddNewImage = true;
      return;
    }

    if (!this.disable && this.imageFiles.length < this.maxItem) {
      this.showAddNewImage = true;
      return;
    }

    if (this.disable && this.imageFiles.length < this.maxItem) {
      this.showAddNewImage = false;
      return;
  }
  }


  onAddFiles( event: any ) {
    const filesArray = Array.from( event.target.files );
    if ( filesArray.length > 0 ) {
      filesArray.forEach( ( file: any ) => {
        if ( this.helpers.validateFile( file ) ) {
          this.totalImgSize += file.size / 1000 / 1000;
          this.totalImgSize = Number( this.totalImgSize.toFixed( 2 ) );
          const fileReader: FileReader = new FileReader();
          fileReader.onloadend = ( e ) => {
            if ( this.imageFiles.length < this.maxItem ) this.imageFiles.push( new FileUploadModel( file, fileReader.result, false, '', this.imageFiles.length + 1 ) );
            this.detectors.detectChanges();
            this.totalImgSize = this.imageFiles.reduce( ( acc, item ) => {
              acc += item.fileInfo?.size ? (item.fileInfo?.size / 1000 / 1000) : 0;
              return Number( acc.toFixed( 2 ) );
            }, 0 )
            this.imageFiles.length < 2 ? this.noteLabel = "Dung lượng ảnh:" : this.noteLabel = "Tổng dung lượng ảnh:"
            this.checkImagesSize( this.imageFiles );
            this.imagesToUpload.emit( this.imageFiles );
            this.checkConditionAddNewImage();
          };
          fileReader.readAsDataURL( file );
        }
      } );
    }
  }

  onFileChanged( $event: any, index: number ) {
    const filesArray = Array.from( $event.target.files );
    if ( filesArray.length > 0 ) {
      if ( filesArray.length > 1 ) this.noteLabel = "Tổng dung lượng ảnh:"
		
      filesArray.forEach( ( file: any ) => {
        if ( this.helpers.validateFile( file ) ) {
          const fileReader: FileReader = new FileReader();
          fileReader.onloadend = ( e ) => {
            if ( this.imageFiles[index].id ) this.itemsToRemove.emit( this.imageFiles[index].id )
            this.imageFiles[index] = new FileUploadModel( file, fileReader.result, false, '', index );
            this.detectors.detectChanges();
            this.totalImgSize = this.imageFiles.reduce( ( acc, item ) => {
              acc += item.fileInfo?.size ? (item.fileInfo?.size / 1000 / 1000) : 0;
              return Number( acc.toFixed( 2 ) );
            }, 0 )
            this.checkImagesSize( this.imageFiles );
            this.imagesToUpload.emit( this.imageFiles );
          };
          fileReader.readAsDataURL( file );
          this.checkConditionAddNewImage();
        }
      } );
    }
  }

  deleteImage( event: any, index: number ) {
    this.totalImgSize = 0;
    if ( this.imageFiles.length === 1 && this.isRequired ) {
      this.checkImagesSize( this.imageFiles );
      this.noteLabel = "Dung lượng ảnh:"
      this.totalImgSize = this.imageFiles.reduce( ( acc, item ) => {
        acc += item.fileInfo?.size ? (item.fileInfo?.size / 1000 / 1000) : 0;
        return Number( acc.toFixed( 2 ) );
      }, 0 )
      this.alertService.fireSmall( 'error', this.requiredMessage );
      return;
    }

    if ( this.imageFiles[index].id ) {
      this.itemsToRemove.emit( this.imageFiles[index].id )
    }

    this.imageFiles.splice( index, 1 );
    this.totalImgSize = this.imageFiles.reduce( ( acc, item ) => {
      acc += item.fileInfo?.size ? (item.fileInfo?.size / 1000 / 1000) : 0;
      return Number( acc.toFixed( 2 ) );
    }, 0 )
    this.imageFiles.length < 2 ? this.noteLabel = "Dung lượng ảnh:" : this.noteLabel = "Tổng dung lượng ảnh:"
    this.checkImagesSize( this.imageFiles );
    this.imagesToUpload.emit( this.imageFiles );

    let isDeleted: boolean = false;
    if (event) isDeleted = true;
    this.actionDelete.emit(isDeleted);
  }

  onInputClick( event: any ) {
    event.target.value = '';
  }

  checkImagesSize( images: FileUploadModel[] ) {
    let isValidRatio = true;
    images.forEach( ( image: FileUploadModel, index ) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const ratio = Number( (width / height).toFixed( 1 ) );
        this.imageFiles[index].imageMeta = { width, height, ratio };
        if ( this.requiredRatio ) {
          isValidRatio = isValidRatio && ratio === Number( (this.requiredRatio.width / this.requiredRatio.height).toFixed( 1 ) );
        }
        this.isWrongRatio = !isValidRatio;
        this.imageFiles[index].isValid = isValidRatio;

        this.imagesInvalid.emit( this.isWrongRatio );
        this.detectors.detectChanges();
      };

      image.imgBase64 && (img.src = image.imgBase64 as string);
    } );
  }


  private transformRatio( ratio: string ) {
    const ratioArr = ratio.split( ':' );
    return { width: Number( ratioArr[0] ), height: Number( ratioArr[1] ) }
  }

  private calculateRatio( width: number, height: number ) {
    return Number( (width / height).toFixed( 1 ) );
  }

  ngOnInit(): void {
    if(this.imageRatio) this.requiredRatio = this.transformRatio( this.imageRatio );
    if(this.imageRatio) this.ratioNumber = this.calculateRatio( this.requiredRatio.width, this.requiredRatio.height );
  }

}
