import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Auction {
  id: number;
  name: string;
  start: string;
  end: string;
  content: string;
  imagePath: string;
  pdfPath: string;
  isDeleted?: boolean;
  isPermanentlyDeleted?: boolean;
  status?: 'current' | 'upcoming' | 'ended';
  timeLeft?: string;
  timeToStart?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private readonly baseUrl = 'https://osuselriadah.somee.com/api/Auction';

  constructor(private http: HttpClient) {}

  getAllAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.baseUrl);
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.baseUrl}/GetById/${id}`);
  }

  createAuction(auctionData: Omit<Auction, 'id'>): Observable<Auction> {
    return this.http.post<Auction>(`${this.baseUrl}/add`, auctionData);
  }

  updateAuction(auctionData: Auction): Observable<Auction> {
    return this.http.post<Auction>(`${this.baseUrl}/update`, auctionData);
  }

  deleteAuction(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/Delete/${id}`, {});
  }

  calculateAuctionStatus(
    startDate: string,
    endDate: string
  ): 'upcoming' | 'current' | 'ended' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'current';
    return 'ended';
  }
}
