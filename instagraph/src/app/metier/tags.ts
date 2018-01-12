import { Image } from "./image";

export class Tag{
    constructor(
        public id: number,
        public libelle: string,
        public description: string,
        public contents?: Image[]
    )
    {};
}