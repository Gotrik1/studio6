import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Shield, Users, Trophy, Star, Handshake, Gavel, Award, Twitter, Youtube, Instagram, Facebook } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from "@/components/icons"

const benefits = [
  {
    icon: Gamepad2,
    role: "Для игроков",
    points: ["Найди команду своей мечты", "Отслеживай свой прогресс и рейтинг ELO"]
  },
  {
    icon: Shield,
    role: "Для капитанов",
    points: ["Управляй составом и расписанием", "Создавай тактики и веди команду к победе"]
  },
  {
    icon: Gavel,
    role: "Для судей",
    points: ["Получай приглашения на турниры", "Строй карьеру сертифицированного арбитра"]
  },
  {
    icon: Star,
    role: "Для болельщиков",
    points: ["Следи за любимыми командами", "Участвуй в жизни киберспортивного сообщества"]
  },
  {
    icon: Handshake,
    role: "Для спонсоров",
    points: ["Находи перспективные команды и турниры", "Продвигай свой бренд среди геймеров"]
  },
  {
    icon: Trophy,
    role: "Для организаторов",
    points: ["Создавай турниры любого масштаба", "Автоматизируй управление сеткой и участниками"]
  },
];

const testimonials = [
  {
    name: "Алексей 'CyberCat' Иванов",
    role: "Капитан 'Quantum Leap'",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "esports player",
    text: "С ProDvor мы смогли найти двух недостающих игроков и наконец-то выиграли наш первый крупный турнир. Управление командой стало в разы проще!"
  },
  {
    name: "Елена 'Valkyrie' Смирнова",
    role: "Организатор 'Urals Cyber Cup'",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "business woman",
    text: "Организация турнира на 64 команды раньше была головной болью. Теперь всё в одном месте — от регистрации до финальной сетки. Это просто спасение."
  },
  {
    name: "Sponsor Inc.",
    role: "Партнер платформы",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "corporate logo",
    text: "Мы нашли несколько перспективных команд для поддержки благодаря ProDvor. Это отличная площадка для инвестиций в будущее киберспорта."
  }
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">ProDvor</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth">Войти</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Начать бесплатно</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] w-full">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Киберспортивная арена"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            data-ai-hint="esports stadium"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">Твой путь в большой спорт</h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              ProDvor — это единая платформа, где дворовый спорт встречается с профессиональным киберспортом. Создавай команды, участвуй в турнирах и становись легендой.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="font-semibold">
                <Link href="/auth">Начать играть</Link>
              </Button>
              <Button size="lg" variant="secondary" className="font-semibold">
                Скачать приложение
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="container py-16 text-center md:py-24">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Что такое ProDvor?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Это больше, чем просто сайт. Это целая экосистема для всех, кто увлечен соревновательным духом — от дворовых футбольных матчей до мировых киберспортивных арен. Мы предоставляем инструменты, которые помогают игрокам расти, командам — организовываться, а организаторам — проводить мероприятия мирового уровня. Наша миссия — дать каждому шанс проявить себя и превратить хобби в настоящую карьеру.
            </p>
        </section>
        
        {/* Benefits Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">Платформа для каждого</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Неважно, кто вы в мире спорта — у нас есть инструменты для ваших целей.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.role} className="flex flex-col">
                  <CardHeader className="flex-row items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-xl">{benefit.role}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
                      {benefit.points.map(point => <li key={point}>{point}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="container py-16 md:py-24">
           <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">Взгляни на платформу</h2>
           <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Интуитивный интерфейс, который помогает сосредоточиться на главном — игре.
            </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg border">
              <Image src="https://placehold.co/800x600.png" alt="Профиль игрока" width={800} height={600} className="transition-transform hover:scale-105" data-ai-hint="user profile dashboard" />
            </div>
             <div className="overflow-hidden rounded-lg border">
              <Image src="https://placehold.co/800x600.png" alt="Турнирная сетка" width={800} height={600} className="transition-transform hover:scale-105" data-ai-hint="tournament bracket" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">Истории успеха</h2>
             <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Нам доверяют тысячи игроков, команд и организаторов.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="pt-6">
                    <blockquote className="italic text-muted-foreground">"{testimonial.text}"</blockquote>
                    <div className="mt-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 text-center md:py-24">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Готов начать?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Присоединяйся к тысячам игроков и начни свой путь к славе уже сегодня. Регистрация займет меньше минуты.
          </p>
          <div className="mx-auto mt-8 max-w-sm">
            <form className="flex flex-col gap-2 sm:flex-row">
              <Input type="email" placeholder="Ваш email" className="h-12 flex-1 text-base" />
              <Button type="submit" size="lg" className="h-12 font-semibold">Зарегистрироваться</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">или войдите через</p>
            <div className="mt-4 flex justify-center gap-4">
               <Button variant="outline" className="w-full sm:w-auto"><Users className="mr-2" /> Google</Button>
               <Button variant="outline" className="w-full sm:w-auto"><Star className="mr-2" /> VK</Button>
               <Button variant="outline" className="w-full sm:w-auto"><Award className="mr-2" /> Yandex</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="font-headline font-semibold">ProDvor</h3>
              <p className="mt-2 text-sm text-muted-foreground">Платформа для дворового и киберспорта.</p>
               <div className="mt-4 flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5"/></Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5"/></Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5"/></Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Youtube className="h-5 w-5"/></Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Навигация</h3>
              <ul className="mt-2 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Команды</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Турниры</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Игроки</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold">Ресурсы</h3>
              <ul className="mt-2 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Документы</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Партнерство</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Поддержка</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Правовая информация</h3>
              <ul className="mt-2 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Политика конфиденциальности</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Условия использования</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Оферта</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProDvor. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
