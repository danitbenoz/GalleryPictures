import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './styles.css';

const GalleryImage = ({ src, alt }) => {
    const [inView, setInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const imgElement = imgRef.current;
        const loadListener = () => {
            setInView(true);
        };

        if (imgElement) {
            imgElement.addEventListener('load', loadListener);
        }

        return () => {
            if (imgElement) {
                imgElement.removeEventListener('load', loadListener);
            }
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={inView ? 'fade-in' : ''}
        />
    );
};

const Gallery = ({ selectedDate }) => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const loadingMore = useRef(false); // To prevent concurrent requests

    const loadMoreImages = useCallback(() => {
        if (!hasMore || loadingMore.current) return;
        loadingMore.current = true;
        setPage(prevPage => prevPage + 1);
    }, [hasMore]);

    useEffect(() => {
        const randomPage = Math.floor(Math.random() * 100) + 1;
        console.log(randomPage);
        setImages([]);
        setPage(randomPage);
        setHasMore(true);
    }, [selectedDate]);

    useEffect(() => {
        axios
            .get(`https://picsum.photos/v2/list?page=${page}&limit=30`)
            .then(response => {
                loadingMore.current = false;
                if (response.data.length === 0) {
                    setHasMore(false);
                } else {
                    setImages(prevImages => [...prevImages, ...response.data]);
                }
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                loadingMore.current = false; // Ensure it's reset on error
            });
    }, [page]);

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }
        const callback = entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreImages();
            }
        };
        observer.current = new IntersectionObserver(callback, {
            rootMargin: '200px', // Adjust as needed
        });
        if (document.querySelector('.gallery img:last-child')) {
            observer.current.observe(document.querySelector('.gallery img:last-child'));
        }
    }, [images, hasMore, loadMoreImages]);

    return (
        <div className="gallery">
        {images.map((image, index) => (
            <GalleryImage key={index} src={image.download_url} alt={image.author} />
        ))}


        </div>
    );
};

export default Gallery;
