// ArtDetails.js
import React from 'react';
import ArtUpload from './ArtUpload';
import ArtEditDetails from './ArtEditDetails';

// Components takes the property spaceId, and renders subcomponents based on it (by passing spaceId through into each subcomponent)
// So when spaceId changes in the parent component ArtStudio (when a different space is clicked), ArtUpload and ArtEditDetails components are updated with the new spaceId
// Also takes the onArtUpload prop function from ArtStudio.js and passes it through to the ArtUpload component
const ArtDetails = ({ spaceId, onArtUpload }) => {
    return (
        <div className='art-details'>
            <ArtUpload spaceId={spaceId} onArtUpload={onArtUpload} />
            <ArtEditDetails spaceId={spaceId} />
        </div>
    );
};

export default ArtDetails;
