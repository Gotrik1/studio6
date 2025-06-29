
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { SitemapTree } from "@/widgets/sitemap-tree";

export function SitemapPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Карта сайта</h1>
                <p className="text-muted-foreground">
                    Интерактивная карта всех страниц и разделов приложения.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Структура приложения</CardTitle>
                    <CardDescription>Нажмите на элемент, чтобы перейти на соответствующую страницу.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SitemapTree />
                </CardContent>
            </Card>
        </div>
    );
}
