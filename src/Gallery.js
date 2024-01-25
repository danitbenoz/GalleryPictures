import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './styles.css'

const GalleryImage = ({ src, alt }) => {
    const [inView, setInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
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

    const loadMoreImages = useCallback(() => {
        if (!hasMore) return;
        setPage(prevPage => prevPage + 1);
    }, [hasMore]); 

    useEffect(() => {
        const randomPage = Math.floor(Math.random() * 100) + 1; 
        setImages([]);
        setPage(randomPage);
        setHasMore(true);
    }, [selectedDate]);

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

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }
        const callback = entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreImages();
            }
        };
        observer.current = new IntersectionObserver(callback);
        if (document.querySelector('.gallery img:last-child')) {
            observer.current.observe(document.querySelector('.gallery img:last-child'));
        }
    }, [images, hasMore, loadMoreImages]); 

    return (
        <div className="gallery">
            {images.map(image => (
                <GalleryImage key={image.id} src={image.download_url} alt={image.author} />
            ))}
        </div>
    );
};

export default Gallery;
