export class ShortenedLinkAlreadyExists extends Error {
   constructor() {
      super("Shortened link already exists.")
   }
}
