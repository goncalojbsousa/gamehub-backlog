import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 50) {
            return NextResponse.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            );
        }

        // Validate sort parameters
        const validSortFields = ['createdAt', 'updatedAt', 'rating'];
        const validSortOrders = ['asc', 'desc'];
        
        if (!validSortFields.includes(sortBy) || !validSortOrders.includes(sortOrder)) {
            return NextResponse.json(
                { error: 'Invalid sort parameters' },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;

        // Get total count of reviews for pagination
        const totalReviews = await prisma.review.count({
            where: {
                userId: userId
            }
        });

        // Get reviews with pagination and sorting
        const primaryOrder: any = { [sortBy]: sortOrder };
        // Deterministic tie-breaker: when sorting by rating, use createdAt desc as secondary.
        // For date fields, fall back to id desc to keep consistent ordering.
        const secondaryOrder: any = sortBy === 'rating' ? { createdAt: 'desc' } : { id: 'desc' };

        const reviews = await prisma.review.findMany({
            where: {
                userId: userId
            },
            orderBy: [primaryOrder, secondaryOrder],
            skip: offset,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        });

        const totalPages = Math.ceil(totalReviews / limit);

        return NextResponse.json({
            reviews,
            pagination: {
                currentPage: page,
                totalPages,
                totalReviews,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching user reviews:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 