export default interface Note {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    isFavorite: boolean;
    backgroundColor: string;
    textColor: string;
    createdAt: string;
}