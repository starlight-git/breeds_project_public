import { NextRequest, NextResponse } from 'next/server';
import * as DogBreedService from '@/services/dogBreedsService';
import { DogBreedsById } from '@/types/DogBreed';

// Use official type for route parameters
type Params = {
  params: {
    id: string;
  };
};

//vercel depoly
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, context: Params) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const breed: DogBreedsById = await DogBreedService.fetchDogBreedById(id);

    if (!breed) {
      return NextResponse.json({ message: 'Breed not found' }, { status: 404 });
    }

    return NextResponse.json(breed);
  } catch (error) {
    console.error('❌ Failed to fetch dog breed by ID:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
