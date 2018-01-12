import { Tag } from "./tags";

export class Image{
    constructor(
        public id: number, 
        public name: string, 
        public description: string,
        public datetime:string, 
        public fileName:string, 
        public contentType:string, 
        public fileSize: number, 
        public width: number, 
        public height: number,
        public tags?: Tag[]
    ){};
}