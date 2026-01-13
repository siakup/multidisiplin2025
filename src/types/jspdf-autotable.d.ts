declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface UserOptions {
        head?: any[][];
        body?: any[][];
        startY?: number;
        theme?: 'striped' | 'grid' | 'plain';
        headStyles?: any;
        bodyStyles?: any;
        alternateRowStyles?: any;
        columnStyles?: any;
        margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
        styles?: any;
    }

    function autoTable(doc: jsPDF, options: UserOptions): void;

    export default autoTable;
}
