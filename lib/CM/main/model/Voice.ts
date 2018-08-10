export default class Voice {
    public constructor(public language: string, public gender: "Male" | "Female" = "Female", public number: number = 1){}
}