import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AlertCircle, Terminal } from "lucide-react"

export default function ThemeDemoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Демонстрация темы</h1>
        <p className="text-muted-foreground">
          Эта страница демонстрирует, как различные компоненты адаптируются к выбранной цветовой теме.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Кнопки</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>Основная</Button>
            <Button variant="secondary">Вторичная</Button>
            <Button variant="destructive">Деструктивная</Button>
            <Button variant="outline">Контурная</Button>
            <Button variant="ghost">Призрачная</Button>
            <Button variant="link">Ссылка</Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Бейджи</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Основной</Badge>
            <Badge variant="secondary">Вторичный</Badge>
            <Badge variant="destructive">Деструктивный</Badge>
            <Badge variant="outline">Контурный</Badge>
          </CardContent>
        </Card>

        {/* Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Оповещение</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Это основное оповещение!</AlertTitle>
              <AlertDescription>
                Вы можете использовать этот компонент для отображения важной информации.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Это деструктивное оповещение!</AlertTitle>
              <AlertDescription>
                Используйте его для сообщений об ошибках.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Элементы формы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Принять условия</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Режим полета</Label>
            </div>
             <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">По умолчанию</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">Удобный</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={66} />
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
       <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Аккаунт</TabsTrigger>
          <TabsTrigger value="password">Пароль</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader><CardTitle>Таблица</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Продукт</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Тема &quot;Киберпанк&quot;</TableCell>
                    <TableCell><Badge variant="outline">В наличии</Badge></TableCell>
                    <TableCell className="text-right">$25.00</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Золотая рамка</TableCell>
                    <TableCell><Badge>Новинка</Badge></TableCell>
                    <TableCell className="text-right">$10.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Изменить пароль</CardTitle>
              <CardDescription>
                Измените свой пароль здесь. После сохранения вы выйдете из системы.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Текущий пароль</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Новый пароль</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Сохранить пароль</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}
