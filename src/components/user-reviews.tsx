'use client'

import { useState, useEffect, useRef } from 'react';
import { getUserReviews, UserReview } from '@/src/lib/getUserReviews';
import { LoadingIcon } from '@/src/components/svg/loading';
import { RatingStars } from '@/src/components/rating-stars';
import { getCoverImageUrl } from '@/src/utils/utils';
import Image from 'next/image';
import Link from 'next/link';

// Simple in-memory cache to persist user reviews state across unmounts (e.g., tab switches)
const userReviewsCache: Record<string, {
    reviews: UserReview[];
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    gameDetails: Record<number, GameDetails>;
}> = {};

interface GameDetails {
    id: number;
    name: string;
    cover?: {
        url: string;
    };
    slug?: string;
}

interface UserReviewsProps {
    userId: string;
    username: string;
    initialReviews?: UserReview[];
    initialPagination?: {
        currentPage: number;
        totalPages: number;
        totalReviews: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    initialGameDetailsById?: Record<number, GameDetails>;
    initialPage?: number;
    initialSortBy?: string;
    initialSortOrder?: 'asc' | 'desc';
}

export const UserReviews: React.FC<UserReviewsProps> = ({
    userId,
    username,
    initialReviews,
    initialPagination,
    initialGameDetailsById,
    initialPage = 1,
    initialSortBy = 'createdAt',
    initialSortOrder = 'desc',
}) => {
    const [reviews, setReviews] = useState<UserReview[]>(initialReviews || []);
    const [gameDetails, setGameDetails] = useState<Record<number, GameDetails>>(initialGameDetailsById || {});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPagination?.currentPage || initialPage);
    const [totalPages, setTotalPages] = useState(initialPagination?.totalPages || 1);
    const [totalReviews, setTotalReviews] = useState(initialPagination?.totalReviews || 0);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
    const didUseInitial = useRef<boolean>(!!initialReviews);
    const lastFetchedRef = useRef<{ page: number; sortBy: string; sortOrder: 'asc' | 'desc' } | null>(null);

    const fetchGameDetails = async (gameIds: number[]) => {
        try {
            const response = await fetch('/api/game/getGameByIds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameIds }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch game details');
            }

            const games: GameDetails[] = await response.json();
            const gameDetailsMap: Record<number, GameDetails> = {};
            
            games.forEach(game => {
                gameDetailsMap[game.id] = game;
            });

            setGameDetails(prev => ({ ...prev, ...gameDetailsMap }));
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserReviews(userId, currentPage, 10, sortBy, sortOrder);
            setReviews(data.reviews);
            setTotalPages(data.pagination.totalPages);
            setTotalReviews(data.pagination.totalReviews);
            lastFetchedRef.current = { page: currentPage, sortBy, sortOrder };

            // Fetch game details for new reviews
            const newGameIds = data.reviews
                .map(review => review.gameId)
                .filter(gameId => !gameDetails[gameId]);
            
            if (newGameIds.length > 0) {
                fetchGameDetails(newGameIds);
            }
        } catch (err) {
            setError('Failed to load reviews');
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If we have initial reviews, don't refetch on first mount
        if (didUseInitial.current) {
            didUseInitial.current = false;
            setLoading(false);
            // Ensure we have game details for any IDs missing in the initial map
            const missingIds = reviews
                .map(r => r.gameId)
                .filter(id => !gameDetails[id]);
            if (missingIds.length > 0) {
                fetchGameDetails(missingIds);
            }
            // Mark last fetched as the initial params
            lastFetchedRef.current = { 
                page: initialPagination?.currentPage || initialPage, 
                sortBy: initialSortBy, 
                sortOrder: initialSortOrder 
            };
            return;
        }

        // Load from cache if available and matches current view
        const cached = userReviewsCache[userId];
        if (cached &&
            cached.currentPage === currentPage &&
            cached.sortBy === sortBy &&
            cached.sortOrder === sortOrder
        ) {
            setReviews(cached.reviews);
            setTotalPages(cached.totalPages);
            setTotalReviews(cached.totalReviews);
            // Merge cached game details with any existing
            setGameDetails(prev => ({ ...cached.gameDetails, ...prev }));
            setLoading(false);
            lastFetchedRef.current = { page: currentPage, sortBy, sortOrder };
            return;
        }

        // If we already have data corresponding to the current params, skip refetch
        if (
            lastFetchedRef.current &&
            lastFetchedRef.current.page === currentPage &&
            lastFetchedRef.current.sortBy === sortBy &&
            lastFetchedRef.current.sortOrder === sortOrder
        ) {
            setLoading(false);
            return;
        }

        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, currentPage, sortBy, sortOrder]);

    // Save to cache on unmount so that switching tabs doesn't cause refetches
    useEffect(() => {
        return () => {
            userReviewsCache[userId] = {
                reviews,
                currentPage,
                totalPages,
                totalReviews,
                sortBy,
                sortOrder,
                gameDetails,
            };
        };
    }, [userId, reviews, currentPage, totalPages, totalReviews, sortBy, sortOrder, gameDetails]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSortChange = (newSortBy: string) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <LoadingIcon className="fill-color_icons w-12 h-12 animate-spin" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-color_reverse_sec to-transparent opacity-20 animate-pulse"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-color_text mb-2">Loading Reviews</h3>
                            <p className="text-color_text_sec">Fetching the latest reviews...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail">
                <div className="text-center">
                    <div className="text-8xl mb-6">⚠️</div>
                    <h3 className="text-2xl font-bold text-color_text mb-3">Error Loading Reviews</h3>
                    <p className="text-color_text_sec text-lg mb-6">{error}</p>
                    <button
                        onClick={fetchReviews}
                        className="px-8 py-3 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (totalReviews === 0) {
        return (
            <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail">
                <div className="text-center">
                    <div className="text-8xl mb-6">📝</div>
                    <h3 className="text-2xl font-bold text-color_text mb-3">No Reviews Yet</h3>
                    <p className="text-color_text_sec text-lg">
                        {username} hasn&apos;t written any reviews yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-color_text mb-2">Reviews</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-color_text_sec text-lg">
                            {totalReviews} review{totalReviews !== 1 ? 's' : ''} • Page {currentPage} of {totalPages}
                        </p>
                        {loading && reviews.length > 0 && (
                            <div className="flex items-center gap-2 text-color_accent">
                                <LoadingIcon className="fill-color_accent w-4 h-4 animate-spin" />
                                <span className="text-sm font-medium">Updating...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSortChange('createdAt')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                            sortBy === 'createdAt'
                                ? 'bg-color_reverse_sec text-color_main'
                                : 'bg-color_main text-color_text hover:bg-color_hover'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            Date
                            {sortBy === 'createdAt' && (
                                <span className="text-lg">
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                        </span>
                    </button>
                    <button
                        onClick={() => handleSortChange('rating')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
                            sortBy === 'rating'
                                ? 'bg-color_reverse_sec text-color_main'
                                : 'bg-color_main text-color_text hover:bg-color_hover'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            Rating
                            {sortBy === 'rating' && (
                                <span className="text-lg">
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
                {loading && reviews.length === 0 && (
                    // Skeleton loading for reviews
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="bg-color_main rounded-xl p-6 border border-border_detail animate-pulse">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-32 rounded-xl bg-color_hover"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="h-6 bg-color_hover rounded mb-3 w-3/4"></div>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <div key={i} className="w-4 h-4 bg-color_hover rounded"></div>
                                                    ))}
                                                </div>
                                                <div className="w-12 h-6 bg-color_hover rounded"></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="w-20 h-6 bg-color_hover rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="bg-color_sec rounded-lg p-4 border border-border_detail">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-color_hover rounded w-full"></div>
                                            <div className="h-4 bg-color_hover rounded w-5/6"></div>
                                            <div className="h-4 bg-color_hover rounded w-4/6"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {reviews.map((review) => (
                    <div key={review.id} className="bg-gradient-to-br from-color_main to-color_sec rounded-xl p-6 border border-border_detail hover:shadow-lg transition-all duration-200 hover:border-color_reverse_sec group relative overflow-hidden">
                        <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <Link href={`/game/${gameDetails[review.gameId]?.slug || review.gameId}`}>
                                    <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-color_hover shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                                        {(() => {
                                            const details = gameDetails[review.gameId];
                                            const coverPath = details?.cover?.url;
                                            const computedSrc = coverPath ? getCoverImageUrl(`https://${coverPath}`) : '/url-image.webp';
                                            const altText = details?.name || `Game ${review.gameId}`;
                                            return (
                                                <Image
                                                    src={computedSrc}
                                                    alt={altText}
                                                    fill
                                                    className="object-cover transition-opacity duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/url-image.webp';
                                                    }}
                                                    onLoad={(e) => {
                                                        e.currentTarget.style.opacity = '1';
                                                    }}
                                                    style={{ opacity: 0 }}
                                                />
                                            );
                                        })()}
                                    </div>
                                </Link>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <Link 
                                            href={`/game/${gameDetails[review.gameId]?.slug || review.gameId}`}
                                            className="text-xl font-bold text-color_text hover:text-color_reverse_sec transition-colors duration-200"
                                        >
                                            {gameDetails[review.gameId]?.name || `Game ${review.gameId}`}
                                        </Link>
                                        
                                        <div className="flex items-center gap-4 mt-3">
                                            <RatingStars score={review.rating * 20} size={16} />
                                            <span className="text-sm text-color_text_sec">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-sm text-color_text_sec bg-color_sec px-3 py-1 rounded-full">
                                            {formatDate(review.createdAt)}
                                        </div>
                                        {review.isEdited && (
                                            <div className="flex items-center gap-1 text-xs bg-color_accent text-color_main px-2 py-1 rounded-full font-medium">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                <span>Edited</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {review.content && (
                                    <div className="bg-color_sec rounded-lg p-4 border border-border_detail">
                                        <p className="text-color_text leading-relaxed whitespace-pre-wrap">
                                            {review.content}
                                        </p>
                                    </div>
                                )}

                                {!review.content && (
                                    <div className="bg-color_sec rounded-lg p-4 border border-border_detail">
                                        <p className="text-color_text_sec italic text-center">
                                            No review text provided
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12">
                    <div className="bg-color_main rounded-xl p-4 shadow-lg border border-border_detail">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-6 py-3 bg-color_sec text-color_text rounded-lg hover:bg-color_hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none"
                            >
                                ← Previous
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-color_text font-medium">Page</span>
                                <span className="bg-color_reverse_sec text-color_main px-4 py-2 rounded-lg font-bold">
                                    {currentPage}
                                </span>
                                <span className="text-color_text font-medium">of {totalPages}</span>
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-6 py-3 bg-color_sec text-color_text rounded-lg hover:bg-color_hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 