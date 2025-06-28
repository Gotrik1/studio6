import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, Mail, Send, MessageCircle } from "lucide-react";
import { SupportContactForm } from "@/components/support-contact-form";

const faqCategories = [
  {
    category: "Общие вопросы",
    questions: [
      {
        q: "Что такое ProDvor?",
        a: "ProDvor — это социальная платформа, которая объединяет дворовый спорт и любительский киберспорт, предоставляя инструменты для создания команд, организации турниров и ведения спортивной жизни онлайн.",
      },
      {
        q: "Как мне начать?",
        a: "Просто зарегистрируйтесь, заполните свой профиль, найдите команду или создайте свою, и начните участвовать в матчах и турнирах!",
      },
    ],
  },
  {
    category: "Профили и Команды",
    questions: [
      {
        q: "Как мне сменить роль в профиле?",
        a: "Ваша основная роль выбирается при регистрации. Для получения дополнительных ролей (например, судьи или организатора) необходимо пройти верификацию через поддержку.",
      },
      {
        q: "Как пригласить друга в команду?",
        a: "На странице вашей команды есть кнопка 'Пригласить игрока'. Вы можете отправить ему прямую ссылку или приглашение через платформу.",
      },
    ],
  },
  {
    category: "Турниры и Матчи",
    questions: [
      {
        q: "Как зарегистрироваться на турнир?",
        a: "На странице турнира нажмите кнопку 'Подать заявку'. Если вы капитан, вы сможете зарегистрировать всю свою команду.",
      },
      {
        q: "Как подтвердить результат матча?",
        a: "После завершения матча капитаны обеих команд и судья получают возможность подтвердить или оспорить счет на странице матча.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Центр Поддержки
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Чем мы можем вам помочь?
        </p>
        <div className="relative mx-auto mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по базе знаний..."
            className="h-12 w-full pl-12 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Часто задаваемые вопросы (FAQ)</CardTitle>
              <CardDescription>
                Здесь собраны ответы на самые популярные вопросы.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqCategories.map((category) => (
                  <div key={category.category}>
                    <h3 className="mt-6 mb-2 font-headline text-xl font-semibold">{category.category}</h3>
                    {category.questions.map((faq) => (
                      <AccordionItem key={faq.q} value={faq.q}>
                        <AccordionTrigger>{faq.q}</AccordionTrigger>
                        <AccordionContent>{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Связаться с поддержкой</CardTitle>
              <CardDescription>
                Не нашли ответ? Напишите нам напрямую.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportContactForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Другие способы связи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start"><Mail className="mr-2"/> support@prodvor.com</Button>
                <Button variant="outline" className="w-full justify-start"><Send className="mr-2"/> Telegram</Button>
                <Button variant="outline" className="w-full justify-start"><MessageCircle className="mr-2"/> Чат-бот</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
