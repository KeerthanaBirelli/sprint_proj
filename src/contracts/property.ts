import {
    SmartContract,
    assert,
    method,
    prop,
    type PubKeyHash,
    type ByteString,
} from 'scrypt-ts';

export class Property extends SmartContract {
    @prop()
    propertyId: ByteString;

    @prop()
    latitude: ByteString;

    @prop()
    longitude: ByteString;

    @prop()
    areaCity: ByteString;

    @prop()
    stateSelected: ByteString;

    @prop()
    ownerPublicAddress: PubKeyHash;

    @prop()
    defaultBidAmount: bigint;

    @prop()
    documentUrl: ByteString;

    constructor(
        propertyId: ByteString,
        latitude: ByteString,
        longitude: ByteString,
        areaCity: ByteString,
        stateSelected: ByteString,
        ownerPublicAddress: PubKeyHash,
        defaultBidAmount: bigint,
        documentUrl: ByteString,
    ) {
        super(...arguments);
        this.propertyId = propertyId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.areaCity = areaCity;
        this.stateSelected = stateSelected;
        this.ownerPublicAddress = ownerPublicAddress;
        this.defaultBidAmount = defaultBidAmount;
        this.documentUrl = documentUrl;
    }

    @method()
    public updateProperty(
        latitude: ByteString,
        longitude: ByteString,
        areaCity: ByteString,
        stateSelected: ByteString,
        ownerPublicAddress: PubKeyHash,
        defaultBidAmount: bigint,
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.areaCity = areaCity;
        this.stateSelected = stateSelected;
        this.ownerPublicAddress = ownerPublicAddress;
        this.defaultBidAmount = defaultBidAmount;
        assert(true, "Update property method executed successfully.");
    }
}
