// Enables component features
import React, { useState, useEffect } from 'react';

import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';


const ArtSpacesList = ({ onSelectSpace, updatedArt, artSpaces }) => {
    // artData is an object that houses the fetched art data
    const [artData, setArtData] = useState([]);

    // // initialize DB (we'll interact with this to pull DB image files)
    // const db = getFirestore();

    // Placeholder for missing art
    const placeholderUrl = 'https://i.pinimg.com/originals/a8/2d/16/a82d163cbc08ccce8deefa1e20e067b0.jpg';

    // Initialize artData with artSpaces prop
    useEffect(() => {
        setArtData(
            artSpaces.map((space) => ({
                spaceId: space.id,
                thumbnailUrl: space.artUrl || placeholderUrl,
            }))
        );
    }, [artSpaces]);

    // console.log("ArtSpacesList - artData", artData[0]?.spaceId);
    console.log("ArtSpacesList - artData", artData);


    // Find thumbnail URL for a space ID or use the placeholder
    const getThumbnailUrl = (spaceId) => {
        const art = artData.find((art) => art.spaceId === spaceId);
        return art ? art.thumbnailUrl : placeholderUrl;
    };

    // If the updatedArt prop is updated, call this function to update artData (only change the value for the changed spaceId, to show the new thumbnail)
    useEffect(() => {
        // if there is data in updatedArt
        if (updatedArt.spaceId && updatedArt.artUrl) {
            // Set state. prevArtData refers to the current state of artData
            setArtData((prevArtData) =>
                // Iterates over every art entry in prevArtData
                prevArtData.map((art) =>
                    // For the entry that matches the updatedArt's spaceId, retain existing data but update the thumbnail URL
                    art.spaceId === updatedArt.spaceId
                        ? { ...art, thumbnailUrl: updatedArt.artUrl }
                        : art
                )
            );
        }
    }, [updatedArt]);
    

    // render
    return (
        // Show the list of spaces on HTML
        <div className='list-of-art'>

            {artData.length === 0 && <p>Loading spaces...</p>}
            {artData.length > 0 && (
                <>
                    <p style={{marginTop: 0}}>Left wall</p>
                    <div className='artwork-tile' key="1" onClick={() => onSelectSpace(artData[0].spaceId)}>
                        <img src={getThumbnailUrl(artData[0].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="10" onClick={() => onSelectSpace(artData[1].spaceId)}>
                        <img src={getThumbnailUrl(artData[1].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="11" onClick={() => onSelectSpace(artData[2].spaceId)}>
                        <img src={getThumbnailUrl(artData[2].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="12" onClick={() => onSelectSpace(artData[3].spaceId)}>
                        <img src={getThumbnailUrl(artData[3].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="13" onClick={() => onSelectSpace(artData[4].spaceId)}>
                        <img src={getThumbnailUrl(artData[4].spaceId)} className='art-thumbnail' />
                    </div>

                    <p>Right wall</p>
                    <div className='artwork-tile' key="14" onClick={() => onSelectSpace(artData[5].spaceId)}>
                        <img src={getThumbnailUrl(artData[5].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="15" onClick={() => onSelectSpace(artData[6].spaceId)}>
                        <img src={getThumbnailUrl(artData[6].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="16" onClick={() => onSelectSpace(artData[7].spaceId)}>
                        <img src={getThumbnailUrl(artData[7].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="17" onClick={() => onSelectSpace(artData[8].spaceId)}>
                        <img src={getThumbnailUrl(artData[8].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="18" onClick={() => onSelectSpace(artData[9].spaceId)}>
                        <img src={getThumbnailUrl(artData[9].spaceId)} className='art-thumbnail' />
                    </div>

                    <p>Left inner blocks</p>
                    <div className='artwork-tile' key="19" onClick={() => onSelectSpace(artData[10].spaceId)}>
                        <img src={getThumbnailUrl(artData[10].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="2" onClick={() => onSelectSpace(artData[11].spaceId)}>
                        <img src={getThumbnailUrl(artData[11].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="20" onClick={() => onSelectSpace(artData[12].spaceId)}>
                        <img src={getThumbnailUrl(artData[12].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="21" onClick={() => onSelectSpace(artData[13].spaceId)}>
                        <img src={getThumbnailUrl(artData[13].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="22" onClick={() => onSelectSpace(artData[14].spaceId)}>
                        <img src={getThumbnailUrl(artData[14].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="23" onClick={() => onSelectSpace(artData[15].spaceId)}>
                        <img src={getThumbnailUrl(artData[15].spaceId)} className='art-thumbnail' />
                    </div>

                    <p>Right inner blocks</p>
                    <div className='artwork-tile' key="24" onClick={() => onSelectSpace(artData[16].spaceId)}>
                        <img src={getThumbnailUrl(artData[16].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="3" onClick={() => onSelectSpace(artData[17].spaceId)}>
                        <img src={getThumbnailUrl(artData[17].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="4" onClick={() => onSelectSpace(artData[18].spaceId)}>
                        <img src={getThumbnailUrl(artData[18].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="5" onClick={() => onSelectSpace(artData[19].spaceId)}>
                        <img src={getThumbnailUrl(artData[19].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="6" onClick={() => onSelectSpace(artData[20].spaceId)}>
                        <img src={getThumbnailUrl(artData[20].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="7" onClick={() => onSelectSpace(artData[21].spaceId)}>
                        <img src={getThumbnailUrl(artData[21].spaceId)} className='art-thumbnail' />
                    </div>

                    <p>Entrance and Back walls</p>
                    <div className='artwork-tile' key="8" onClick={() => onSelectSpace(artData[22].spaceId)}>
                        <img src={getThumbnailUrl(artData[22].spaceId)} className='art-thumbnail' />
                    </div>
                    <div className='artwork-tile' key="9" onClick={() => onSelectSpace(artData[23].spaceId)}>
                        <img src={getThumbnailUrl(artData[23].spaceId)} className='art-thumbnail' />
                    </div>

                </>
            )}

            
            
            
        </div>
    );
};

export default ArtSpacesList;
