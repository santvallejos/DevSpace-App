using System.ComponentModel.DataAnnotations;

namespace api.Infrastructure.Validation
{
    // Atributo de validación personalizado que permite explícitamente todos los caracteres especiales
    // incluyendo paréntesis, comillas dobles, backticks, asteriscos, ampersands,
    // llaves, corchetes, símbolos matemáticos y otros caracteres especiales.

    // Este atributo fue creado específicamente para resolver problemas con el manejo de caracteres
    // especiales en campos de código y texto que requieren flexibilidad total en el contenido.
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class AllowSpecialCharactersAttribute : ValidationAttribute
    {

        // Constructor del atributo de validación
        public AllowSpecialCharactersAttribute()
        {
            ErrorMessage = "El campo contiene caracteres no válidos";
        }


        // Método principal de validación que determina si el valor es válido
        // <param name="value">El valor a validar (generalmente un string)</param>
        // <returns>true si el valor es válido, false en caso contrario</returns>
        public override bool IsValid(object? value)
        {
            // Si el valor es null o vacío, es válido (usar Required para validar obligatoriedad)
            if (value == null || string.IsNullOrEmpty(value.ToString()))
            {
                return true;
            }

            var stringValue = value.ToString()!;

            // Solo rechazar caracteres de control que no sean espacios en blanco normales
            foreach (char c in stringValue)
            {
                // Permitir:
                // - Todos los caracteres imprimibles (>= 32)
                // - Tabulaciones (\t = 9)
                // - Saltos de línea (\n = 10)
                // - Retorno de carro (\r = 13)
                if (char.IsControl(c) && c != '\t' && c != '\n' && c != '\r')
                {
                    ErrorMessage = $"El carácter de control '{(int)c}' no está permitido";
                    return false;
                }
            }

            return true;
        }

        // Formatea el mensaje de error personalizado cuando la validación falla
        // <param name="name">El nombre del campo que falló la validación</param>
        // <returns>Mensaje de error formateado</returns>
        public override string FormatErrorMessage(string name)
        {
            return $"El campo {name} contiene caracteres no válidos. Se permiten todos los caracteres imprimibles incluyendo caracteres especiales como (), \"\", ``, *, etc.";
        }
    }
}