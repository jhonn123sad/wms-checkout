#!/bin/bash

# TEST SCRIPT FOR create-pix EDGE FUNCTION
# Tests the corrected function against all required rules

echo "=========================================="
echo "TESTE DE VALIDAÇÃO: create-pix v2.1.1"
echo "=========================================="
echo ""

# Configurar variáveis de teste
SUPABASE_URL="$SUPABASE_URL"
SUPABASE_KEY="$SUPABASE_ANON_KEY"

echo "Usando SUPABASE_URL: $SUPABASE_URL"
echo ""

# Teste 1: comunidade-wms = R$ 50,00 (5000 centavos)
echo "TESTE 1: checkout_slug = comunidade-wms"
echo "Resultado esperado: amount_cents = 5000, checkout_slug = comunidade-wms"
echo ""

RESPONSE1=$(curl -s -X POST "$SUPABASE_URL/functions/v1/create-pix" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"checkout_slug":"comunidade-wms"}')

echo "Resposta completa:"
echo "$RESPONSE1" | jq '.'
echo ""

amount_cents_1=$(echo "$RESPONSE1" | jq '.amount_cents')
checkout_slug_1=$(echo "$RESPONSE1" | jq -r '.checkout_slug')
function_version=$(echo "$RESPONSE1" | jq -r '.function_version')

echo "Valores extraídos:"
echo "  amount_cents: $amount_cents_1 (esperado 5000)"
echo "  checkout_slug: $checkout_slug_1 (esperado comunidade-wms)"
echo "  function_version: $function_version"
echo ""

if [[ "$amount_cents_1" == "5000" && "$checkout_slug_1" == "comunidade-wms" ]]; then
  echo "✅ TESTE 1: PASSOU"
else
  echo "❌ TESTE 1: FALHOU"
fi
echo ""

# Teste 2: wms-novo-teste = R$ 37,00 (3700 centavos)
echo "TESTE 2: checkout_slug = wms-novo-teste"
echo "Resultado esperado: amount_cents = 3700, checkout_slug = wms-novo-teste"
echo ""

RESPONSE2=$(curl -s -X POST "$SUPABASE_URL/functions/v1/create-pix" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"checkout_slug":"wms-novo-teste"}')

echo "Resposta completa:"
echo "$RESPONSE2" | jq '.'
echo ""

amount_cents_2=$(echo "$RESPONSE2" | jq '.amount_cents')
checkout_slug_2=$(echo "$RESPONSE2" | jq -r '.checkout_slug')

echo "Valores extraídos:"
echo "  amount_cents: $amount_cents_2 (esperado 3700)"
echo "  checkout_slug: $checkout_slug_2 (esperado wms-novo-teste)"
echo ""

if [[ "$amount_cents_2" == "3700" && "$checkout_slug_2" == "wms-novo-teste" ]]; then
  echo "✅ TESTE 2: PASSOU"
else
  echo "❌ TESTE 2: FALHOU"
fi
echo ""

# Teste 3: receitas-praticas = R$ 14,90 (1490 centavos)
echo "TESTE 3: checkout_slug = receitas-praticas"
echo "Resultado esperado: amount_cents = 1490, checkout_slug = receitas-praticas"
echo ""

RESPONSE3=$(curl -s -X POST "$SUPABASE_URL/functions/v1/create-pix" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"checkout_slug":"receitas-praticas"}')

echo "Resposta completa:"
echo "$RESPONSE3" | jq '.'
echo ""

amount_cents_3=$(echo "$RESPONSE3" | jq '.amount_cents')
checkout_slug_3=$(echo "$RESPONSE3" | jq -r '.checkout_slug')

echo "Valores extraídos:"
echo "  amount_cents: $amount_cents_3 (esperado 1490)"
echo "  checkout_slug: $checkout_slug_3 (esperado receitas-praticas)"
echo ""

if [[ "$amount_cents_3" == "1490" && "$checkout_slug_3" == "receitas-praticas" ]]; then
  echo "✅ TESTE 3: PASSOU"
else
  echo "❌ TESTE 3: FALHOU"
fi
echo ""

# Teste 4: visagismo-ia = R$ 39,90 (3990 centavos)
echo "TESTE 4: checkout_slug = visagismo-ia"
echo "Resultado esperado: amount_cents = 3990, checkout_slug = visagismo-ia"
echo ""

RESPONSE4=$(curl -s -X POST "$SUPABASE_URL/functions/v1/create-pix" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"checkout_slug":"visagismo-ia"}')

echo "Resposta completa:"
echo "$RESPONSE4" | jq '.'
echo ""

amount_cents_4=$(echo "$RESPONSE4" | jq '.amount_cents')
checkout_slug_4=$(echo "$RESPONSE4" | jq -r '.checkout_slug')

echo "Valores extraídos:"
echo "  amount_cents: $amount_cents_4 (esperado 3990)"
echo "  checkout_slug: $checkout_slug_4 (esperado visagismo-ia)"
echo ""

if [[ "$amount_cents_4" == "3990" && "$checkout_slug_4" == "visagismo-ia" ]]; then
  echo "✅ TESTE 4: PASSOU"
else
  echo "❌ TESTE 4: FALHOU"
fi
echo ""

# Resumo Final
echo "=========================================="
echo "RESUMO DOS TESTES"
echo "=========================================="
echo ""

TOTAL_TESTS=4
PASSED_TESTS=0

[[ "$amount_cents_1" == "5000" && "$checkout_slug_1" == "comunidade-wms" ]] && ((PASSED_TESTS++))
[[ "$amount_cents_2" == "3700" && "$checkout_slug_2" == "wms-novo-teste" ]] && ((PASSED_TESTS++))
[[ "$amount_cents_3" == "1490" && "$checkout_slug_3" == "receitas-praticas" ]] && ((PASSED_TESTS++))
[[ "$amount_cents_4" == "3990" && "$checkout_slug_4" == "visagismo-ia" ]] && ((PASSED_TESTS++))

echo "Testes passados: $PASSED_TESTS/$TOTAL_TESTS"
echo ""

if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
  echo "✅ TODOS OS TESTES PASSARAM!"
  echo "A função create-pix está corrigida."
  exit 0
else
  echo "❌ ALGUNS TESTES FALHARAM!"
  echo "A função ainda precisa de correção."
  exit 1
fi
