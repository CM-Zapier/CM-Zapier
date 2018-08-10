export default class Link {
    public constructor(private readonly description: string, private readonly url: string){}

    public toString(){
        return `[${this.description}](${this.url})`
    }
}