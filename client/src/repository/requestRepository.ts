import { fetch } from "@inrupt/solid-client-authn-browser";
import {
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing,
    getThingAll
} from "@inrupt/solid-client";
import profileDefinition from "../definitions/profile.json";
import mindMapDefinition from "../definitions/mindMap.json";
import requestDefinition from "../definitions/request.json";
import linkDefinition from "../definitions/link.json";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { UserSession } from "../models/types/UserSession";
import { MRIZKA, PROFILE, SLASH, TTLFILETYPE, WIKIMIND } from "../service/containerService";
import { MindMap } from "../models/types/MindMap";
import { Request } from "../models/types/Request";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { getNumberFromUrl } from "./utils";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { LDO } from "../models/LDO";
import { RequestLDO } from "../models/things/RequestLDO";


export class RequestRepository {
    private requestLDO: RequestLDO
  
    constructor() {
      this.requestLDO = new RequestLDO(requestDefinition);
    }
  
    async getMindMap(requestUrl: string): Promise<Request | undefined> {
        const requestDataset = await getSolidDataset(requestUrl, { fetch });
        const thingId = `${requestUrl}#${getNumberFromUrl(requestUrl)}`
        return this.requestLDO.read(getThing(requestDataset, thingId))
    }

    async createRequest(requestUrl: string, request: Request): Promise<void> {
        let RequestDataset = await getSolidDataset(requestUrl, { fetch });
        RequestDataset = setThing(RequestDataset, this.requestLDO.create(request));
        await saveSolidDatasetAt(requestUrl, RequestDataset, { fetch });
    }
}


