import { LDOIRI } from "../LDOIRI";
import { Class } from "../types/Class";
import { Request } from "../types/Request";
import { Link } from "../types/Link";
import { LinkType } from "../types/LinkType";
import { Node } from "../types/Node";
import { Profile } from "../types/Profile";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";
import { ThingLocal, buildThing, getStringNoLocale, getInteger, createThing } from "@inrupt/solid-client";

export class ClassRequestLDO extends BaseLDO<Request> implements CRUDLDO<Request> {
    read(thing: any): Request {
        return {
            id: getStringNoLocale(thing, (this.rdf.properties.id as LDOIRI).vocabulary)!,
            class: getStringNoLocale(thing, (this.rdf.properties.class as LDOIRI).vocabulary)!,
            requestor: getStringNoLocale(thing, (this.rdf.properties.requestor as LDOIRI).vocabulary)!,
        }
    };

    create(object: Request) {
        const newThing: ThingLocal = buildThing(createThing({ name: object.id }))
            .addUrl(this.rdf.identity.vocabulary, this.rdf.identity.subject)
            .addStringNoLocale((this.rdf.properties.id as LDOIRI).vocabulary,
                object.id)
            .addStringNoLocale((this.rdf.properties.class as LDOIRI).vocabulary,
                object.class)
            .addStringNoLocale((this.rdf.properties.requestor as LDOIRI).vocabulary,
                object.requestor.toString())
            .build();
        return newThing;
    }
}
