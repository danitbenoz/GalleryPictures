import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Gallery = ({ selectedDate }) => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const loadMoreImages = () => {
        if (!hasMore) return;
        setPage(prevPage => prevPage + 1);
    };

    // Generate a random page number when selectedDate changes
    useEffect(() => {
        const randomPage = Math.floor(Math.random() * 100) + 1; // Random page between 1 and 100
        setImages([]); // Clear current images
        setPage(randomPage); // Set new random page
        setHasMore(true); // Reset hasMore flag
    }, [selectedDate]);

    // Fetch images based on the current page
    useEffect(() => {
        axios.get(`https://picsum.photos/v2/list?page=${page}&limit=30`) 
            .then(response => {
                if (response.data.length === 0) {
                    setHasMore(false);
                } else {
                    setImages(prevImages => [...prevImages, ...response.data]);
                }
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, [page]);

    // IntersectionObserver for infinite scrolling
    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        const callback = entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreImages();
            }
        };
        observer.current = new IntersectionObserver(callback);
        if (document.querySelector('.gallery img:last-child')) {
            observer.current.observe(document.querySelector('.gallery img:last-child'));
        }
    }, [images, hasMore]);

    return (
        <div className="gallery">
            {images.map(image => (
                <img key={image.id} src={image.download_url} alt={image.author} />
            ))}
        </div>
    );
};

export default Gallery;
