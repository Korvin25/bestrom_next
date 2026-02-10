export interface BreadcrumbItem {
    label: string;
    to: string;
}

export const useBreadcrumbs = () => {
    const crumbs = useState<BreadcrumbItem[]>('breadcrumbs', () => []);

    const setBreadcrumbs = (items: BreadcrumbItem[]) => {
        crumbs.value = items;
    };

    const addBreadcrumb = (item: BreadcrumbItem) => {
        crumbs.value.push(item);
    };

    const clearBreadcrumbs = () => {
        crumbs.value = [];
    };

    return {
        crumbs,
        setBreadcrumbs,
        addBreadcrumb,
        clearBreadcrumbs,
    };
};
