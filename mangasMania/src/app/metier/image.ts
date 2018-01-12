export class Image{
    constructor(
        public id: number, 
        public fileName: string,
        public fileSize: number,
        public contentType: string,
        public storageId: string,
        public thumbStorageId:string
    )
    {};
}