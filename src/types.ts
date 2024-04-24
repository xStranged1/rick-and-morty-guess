
export interface Location{
    name: string,
    url: string,
}

export type Difficult = 'easy' | 'medium' | 'hard'

export interface Origin{
    name: string,
    url: string,
}

export interface ImgCharacterProps {
    url?: string;
  }

export interface Character {
    id: number,
    created: string,
    image: string,
    name: string,
    episode: string[],
    gender: string,
    location: Location,
    origin: Origin,
    species: string,
    status: string,
}
