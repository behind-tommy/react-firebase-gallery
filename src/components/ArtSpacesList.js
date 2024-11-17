// Enables component features
import React, { useState, useEffect } from 'react';

import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';


const ArtSpacesList = ({ onSelectSpace }) => {
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
            {spaces.map((space) => (
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
            ))}
        </div>
    );
};

export default ArtSpacesList;
