// Enables component features
import React, { useState, useEffect } from 'react';

import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';


const ArtSpacesList = ({ onSelectSpace, updatedArt }) => {
    // artData is an object that houses the fetched art data
    const [artData, setArtData] = useState([]);

    // initialize DB (we'll interact with this to pull DB image files)
    const db = getFirestore();

    // Placeholder for missing art
    const placeholderUrl = 'https://via.placeholder.com/150';

    // Fetch art data from Firestore
    useEffect(() => {
        const fetchArtData = async () => {
            try {
                // Reference to the 'spaces' collection in Firestore
                const spacesCollectionRef = collection(db, 'spaces');

                // Fetch all documents in the 'spaces' collection
                const querySnapshot = await getDocs(spacesCollectionRef);

                console.log(querySnapshot.docs[0].data());

                // Map through the documents to extract the data
                const fetchedData = querySnapshot.docs.map((doc) => ({
                    spaceId: doc.id, // Use the document ID as the space ID
                    thumbnailUrl: doc.data().artUrl // Use 'artURL' field or fallback to placeholder
                }));
                
                // Update the component's state with fetched data
                setArtData(fetchedData);
            } catch (error) {
                console.error('Error fetching art data from Firestore:', error);
            }
        };

        fetchArtData();
    }, []);

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

    // Find thumbnail URL for a space ID or use the placeholder
    const getThumbnailUrl = (spaceId) => {
        const art = artData.find((art) => art.spaceId === spaceId);
        return art ? art.thumbnailUrl : placeholderUrl;
    };

    // A list of art spaces
    const spaces = [
        { id: "1", name: 'Art Space 1' },
        { id: "2", name: 'Art Space 2' },
        { id: "3", name: 'Art Space 3' },
        { id: "4", name: 'Art Space 4' },
        { id: "5", name: 'Art Space 5' },
        { id: "6", name: 'Art Space 6' },
        { id: "7", name: 'Art Space 7' },
        { id: "8", name: 'Art Space 8' },
        { id: "9", name: 'Art Space 9' },
        { id: "10", name: 'Art Space 10' },
        { id: "11", name: 'Art Space 11' },
        { id: "12", name: 'Art Space 12' },
        { id: "13", name: 'Art Space 13' },
        { id: "14", name: 'Art Space 14' },
        { id: "15", name: 'Art Space 15' },
        { id: "16", name: 'Art Space 16' },
        { id: "17", name: 'Art Space 17' },
        { id: "18", name: 'Art Space 18' },
        { id: "19", name: 'Art Space 19' },
        { id: "20", name: 'Art Space 20' },
        { id: "21", name: 'Art Space 21' },
        { id: "22", name: 'Art Space 22' },
        { id: "23", name: 'Art Space 23' },
        { id: "24", name: 'Art Space 24' },
    ];
    

    // render
    return (
        // Show the list of spaces on HTML
        <div className='list-of-art'>
            {/* For each space in const "spaces", create a list item with properties based on the data in "spaces" */}
            {/* When clicked, call the function passed to onSelectSpace. which is setSelectedSpaceId to update the state (this is defined in ArtStudio.js) */}
            {/* {spaces.map((space) => (
                <div
                    key={space.id}
                    onClick={() => onSelectSpace(space.id)}
                    className='artwork-tile'
                >
                     <img
                        src={getThumbnailUrl(space.id)}
                        alt={space.name}
                        className='art-thumbnail'
                    />
                </div>
            ))} */}

            <p style={{marginTop: 0}}>Left wall</p>
            <div className='artwork-tile' key="10" onClick={() => onSelectSpace("10")}>
                <img src={getThumbnailUrl("10")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="11" onClick={() => onSelectSpace("11")}>
                <img src={getThumbnailUrl("11")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="12" onClick={() => onSelectSpace("12")}>
                <img src={getThumbnailUrl("12")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="13" onClick={() => onSelectSpace("13")}>
                <img src={getThumbnailUrl("13")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="24" onClick={() => onSelectSpace("24")}>
                <img src={getThumbnailUrl("24")} className='art-thumbnail' />
            </div>

            <p>Right wall</p>
            <div className='artwork-tile' key="15" onClick={() => onSelectSpace("15")}>
                <img src={getThumbnailUrl("15")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="16" onClick={() => onSelectSpace("16")}>
                <img src={getThumbnailUrl("16")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="17" onClick={() => onSelectSpace("17")}>
                <img src={getThumbnailUrl("17")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="18" onClick={() => onSelectSpace("18")}>
                <img src={getThumbnailUrl("18")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="19" onClick={() => onSelectSpace("19")}>
                <img src={getThumbnailUrl("19")} className='art-thumbnail' />
            </div>

            <p>Left inner blocks</p>
            <div className='artwork-tile' key="1" onClick={() => onSelectSpace("1")}>
                <img src={getThumbnailUrl("1")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="2" onClick={() => onSelectSpace("2")}>
                <img src={getThumbnailUrl("2")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="14" onClick={() => onSelectSpace("14")}>
                <img src={getThumbnailUrl("14")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="23" onClick={() => onSelectSpace("23")}>
                <img src={getThumbnailUrl("23")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="6" onClick={() => onSelectSpace("6")}>
                <img src={getThumbnailUrl("6")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="5" onClick={() => onSelectSpace("5")}>
                <img src={getThumbnailUrl("5")} className='art-thumbnail' />
            </div>

            <p>Right inner blocks</p>
            <div className='artwork-tile' key="3" onClick={() => onSelectSpace("3")}>
                <img src={getThumbnailUrl("3")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="9" onClick={() => onSelectSpace("9")}>
                <img src={getThumbnailUrl("9")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="8" onClick={() => onSelectSpace("8")}>
                <img src={getThumbnailUrl("8")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="20" onClick={() => onSelectSpace("20")}>
                <img src={getThumbnailUrl("20")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="4" onClick={() => onSelectSpace("4")}>
                <img src={getThumbnailUrl("4")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="7" onClick={() => onSelectSpace("7")}>
                <img src={getThumbnailUrl("7")} className='art-thumbnail' />
            </div>

            <p>Entrance and Back walls</p>
            <div className='artwork-tile' key="22" onClick={() => onSelectSpace("22")}>
                <img src={getThumbnailUrl("22")} className='art-thumbnail' />
            </div>
            <div className='artwork-tile' key="21" onClick={() => onSelectSpace("21")}>
                <img src={getThumbnailUrl("21")} className='art-thumbnail' />
            </div>
            
            

            
        </div>
    );
};

export default ArtSpacesList;
