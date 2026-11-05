# Аккаунты GYM TRACKER

Приложение использует Supabase Auth (email + пароль) и таблицу `public.workout_plans` для хранения **полного состояния** приложения в `plan_data` (запись с именем `__gym_tracker_state_v1__`). Созданные ранее `workout_sessions` и `workout_sets` пока не используются: это осознанный промежуточный вариант для сохранения исходной структуры данных без потерь.

## Настройка

1. В Vercel в Root Directory укажите `GYM_TRACKER_React_TypeScript_FIXED`.
2. Добавьте Environment Variables `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY` из **одного и того же проекта** Supabase (Project Settings → API). Не используйте secret/service_role.
3. В Supabase Authentication → URL Configuration установите адрес опубликованного сайта как Site URL и добавьте Redirect URL при необходимости.
4. В Supabase Authentication → Providers → Email включите email/password и подтверждение email. Проверьте отправку писем; встроенная почта Supabase ограничена.
5. Убедитесь, что `public.workout_plans` имеет RLS-политики SELECT/INSERT/UPDATE/DELETE с проверкой `auth.uid() = user_id`, как в ранее созданной схеме. Протестируйте доступ двумя тестовыми аккаунтами.
6. Запустите `npm ci`, `npm run build` и `npm test`, затем разместите сайт.

При первом входе приложение загрузит облачное состояние, а при отсутствии облачных данных предложит импортировать локальные тренировки. Не удаляйте локальные данные до проверки успешной синхронизации. Если два устройства одновременно редактируют тренировки, действует принцип «последняя запись побеждает»; конфликтное слияние пока не реализовано.
