module View exposing (view)

import Data exposing (Model, Page(..), Status(..))
import Html exposing (Html, a, button, div, form, h1, h2, img, input, p, span, text)
import Html.Attributes exposing (class, href, placeholder, src, style, type_, value)
import Html.Events exposing (onClick, onInput, onSubmit)
import LinkListView


type alias Config msg =
    { originalUrlInput : String -> msg
    , shortenedUrlInput : String -> msg
    , createLink : msg
    , deleteLink : String -> msg
    , goToRedirect : String -> msg
    , goToHome : msg
    }


view : Config msg -> Model -> Html msg
view config model =
    div
        [ class "min-h-screen bg-[#F8FAFC] text-slate-800 antialiased"
        , style "font-family" "'Outfit', 'Inter', sans-serif"
        ]
        [ case model.page of
            Home ->
                renderHome config model

            RedirectPage slug ->
                renderRedirectPage config slug
        ]


renderHome : Config msg -> Model -> Html msg
renderHome config model =
    div
        [ class "max-w-6xl mx-auto px-6 py-12" ]
        [ -- Header
          div
            [ class "flex items-center justify-between mb-12" ]
            [ div
                [ class "text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter" ]
                [ text "brev.ly" ]
            ]
        , -- Main Layout Grid
          div
            [ class "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" ]
            [ -- Left Column: Creation Form
              renderFormCard config model
            , -- Right Column: List of shortlinks
              renderLinksCard config model
            ]
        ]


renderFormCard : Config msg -> Model -> Html msg
renderFormCard config model =
    div
        [ class "bg-white rounded-2xl p-8 shadow-sm border border-slate-100" ]
        [ h2
            [ class "text-xl font-bold mb-6 text-slate-900" ]
            [ text "Encurtar um novo link" ]
        , form [ onSubmit config.createLink ]
            [ div [ class "mb-5" ]
                [ div
                    [ class "text-sm font-semibold text-slate-600 mb-2 block" ]
                    [ text "Link Original" ]
                , input
                    [ placeholder "https://exemplo.com/pagina-muito-longa"
                    , value model.originalUrlInput
                    , onInput config.originalUrlInput
                    , class "w-full px-4 py-3 border border-slate-200 rounded-xl text-[15px] outline-none focus:border-blue-500 transition-colors box-border"
                    ]
                    []
                ]
            , div [ class "mb-6" ]
                [ div
                    [ class "text-sm font-semibold text-slate-600 mb-2 block" ]
                    [ text "Apelido Customizado (opcional)" ]
                , div
                    [ class "flex items-center" ]
                    [ div
                        [ class "bg-slate-50 px-4 py-3 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-[15px] font-medium" ]
                        [ text "brev.ly/" ]
                    , input
                        [ placeholder "meu-link"
                        , value model.shortenedUrlInput
                        , onInput config.shortenedUrlInput
                        , class "w-full px-4 py-3 border border-slate-200 rounded-r-xl text-[15px] outline-none focus:border-blue-500 transition-colors box-border"
                        ]
                        []
                    ]
                ]
            , button
                [ type_ "submit"
                , class "w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-base font-semibold cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all duration-150"
                ]
                [ text "Encurtar Link" ]
            ]
        , renderStatus model.status
        ]


renderLinksCard : Config msg -> Model -> Html msg
renderLinksCard config model =
    div
        [ class "bg-white rounded-2xl p-8 shadow-sm border border-slate-100 min-h-[300px]" ]
        [ h2
            [ class "text-xl font-bold mb-6 text-slate-900" ]
            [ text "Meus links encurtados" ]
        , if List.isEmpty model.links then
            div
                [ class "flex flex-col items-center justify-center py-16 text-slate-400 gap-2" ]
                [ span [ class "text-3xl" ] [ text "🔗" ]
                , span [ class "text-sm font-medium" ] [ text "Nenhum link cadastrado ainda." ]
                ]

          else
            LinkListView.renderLinkList
                config.deleteLink
                config.goToRedirect
                model
        ]


renderStatus : Status -> Html msg
renderStatus status =
    case status of
        Loading ->
            div
                [ class "mt-5 flex items-center gap-2 text-blue-600 font-semibold text-sm" ]
                [ div [ class "w-4 height-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" ] []
                , text "Processando..."
                ]

        Success ->
            div [] []

        Error err ->
            div
                [ class "mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium" ]
                [ text err ]


renderRedirectPage : Config msg -> String -> Html msg
renderRedirectPage config slug =
    div
        [ class "min-h-screen bg-slate-50 flex items-center justify-center px-6" ]
        [ div
            [ class "bg-white rounded-3xl px-10 py-12 w-full max-w-[480px] shadow-sm border border-slate-100 flex flex-col items-center text-center" ]
            [ -- Premium visual bouncing rocket / redirect icon
              div
                [ class "relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 animate-pulse" ]
                [ span
                    [ class "text-3xl" ]
                    [ text "🚀" ]
                ]
            , h1
                [ class "text-2xl font-extrabold text-slate-900 mb-3 tracking-tight" ]
                [ text "Redirecionando..." ]
            , p
                [ class "text-[15px] text-slate-500 leading-relaxed mb-8" ]
                [ text "O link será aberto automaticamente em alguns instantes."
                , Html.br [] []
                , span
                    [ class "display-block mt-3 text-sm" ]
                    [ text "Não foi redirecionado? "
                    , a
                        [ href ("http://localhost:3333/" ++ slug)
                        , class "text-blue-600 font-semibold no-underline border-b-2 border-blue-500/20 hover:border-blue-500 transition-colors"
                        ]
                        [ text "Clique aqui" ]
                    ]
                ]
            , button
                [ onClick config.goToHome
                , class "px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-semibold text-sm cursor-pointer transition-colors"
                ]
                [ text "Voltar" ]
            ]
        ]
