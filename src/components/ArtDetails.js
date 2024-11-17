// ArtDetails.js
import React from 'react';
import ArtUpload from './ArtUpload';
import ArtEditDetails from './ArtEditDetails';

// Components takes the property spaceId, and renders subcomponents based on it (by passing spaceId through into each subcomponent)
// So when spaceId changes in the parent component ArtStudio (when a different space is clicked), ArtUpload and ArtEditDetails components are updated with the new spaceId
const ArtDetails = ({ spaceId }) => {
    return (
        <div className='art-details'>
            <ArtUpload spaceId={spaceId} />
            <ArtEditDetails spaceId={spaceId} />
        </div>
    );
};

export default ArtDetails;
