import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    createSolidDataset,
    createThing,
    setThing, hasResourceAcl, hasAccessibleAcl, createAclFromFallbackAcl, getResourceAcl,
    setUrl,
    getThingAll,
    createContainerAt, saveAclFor, acp_ess_2,
    getStringNoLocale, hasFallbackAcl,
    getUrlAll,
    getSolidDatasetWithAcl,
    getUrl,
    getPodUrlAll,
    isContainer,
    getContainedResourceUrlAll,
    Thing, universalAccess,
    getLinkedResourceUrlAll,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { UserSession } from "../models/types/UserSession";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";

/**
* initialzes ACL for resources contained in a WAC POD
* @category Access functions
* @param   {string} url url of the resource to initialze ACL for
* @param   {fetcher} fetch fetch function
* @return  {Promise<void>}
*/
export const initializeAcl = async (url: string): Promise<void> => {


    let myDatasetWithAcl
    try {
        myDatasetWithAcl = await getSolidDatasetWithAcl(url, { fetch: fetch });
    }

    catch (error) {
        let message = 'Unknown Error';
        if (error instanceof Error) message = error.message;
        throw new Error(`Error when fetching dataset, url: ${url} error: ${message}`);
    }
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
        if (!hasAccessibleAcl(myDatasetWithAcl)) {
            throw new Error(
                `The current user does not have permission to change access rights to this resource, url: ${url}`
            );
        }
        if (!hasFallbackAcl(myDatasetWithAcl)) {

            throw new Error(
                `The current user does not have permission to see who currently has access to this resource, url: ${url}`
            );
        }
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
    } else {
        resourceAcl = getResourceAcl(myDatasetWithAcl);
    }
    await saveAclFor(myDatasetWithAcl, resourceAcl, { fetch: fetch });
}


/**
* Function that gets the PODs access mechanism
* @category Access functions
* @param   {string} url url of the resource to get the agent's access for
* @return  {Promise<"wac" | "acp">} returns "wac" or "acp"
*/
export const isWacOrAcp = async (url: string): Promise<AccessControlPolicy> => {
    let dataSetWithAcr;
    try {
        dataSetWithAcr = await acp_ess_2.getSolidDatasetWithAcr(url, { fetch: fetch });
        console.log("ACPPPP")
    }
    catch (error) {
        return AccessControlPolicy.WAC
    }
    if (!dataSetWithAcr.internal_acp.acr) return AccessControlPolicy.WAC;
    return AccessControlPolicy.ACP;
}