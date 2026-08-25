import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Builds a friendly, time-aware greeting for the authenticated user.
   *
   * @param name - The user's display name.
   * @returns A personalized greeting string.
   */
  greetUser(name: string): string {
    const hour = new Date().getHours();

    const timeOfDay =
      hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    return `Good ${timeOfDay}, ${name}! 👋 Welcome back.`;
  }
}
