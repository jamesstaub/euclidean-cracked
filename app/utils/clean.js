export default function clean(title) {
    title = title.toLowerCase();
    title = title.replace(/ /g, '-');
    return title.replace(/[^a-zA-Z0-9-_]/g, '');
}
