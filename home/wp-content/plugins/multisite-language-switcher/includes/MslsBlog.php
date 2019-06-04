<?php
/**
 * MslsBlog
 * @author Dennis Ploetner <re@lloc.de>
 * @since 0.9.8
 */

namespace lloc\Msls;

/**
 * Internal representation of a blog
 * @property int $userblog_id
 * @package Msls
 */
class MslsBlog {

	/**
	 * WordPress generates such an object
	 * @var \StdClass
	 */
	private $obj;

	/**
	 * Language-code eg. de_DE
	 * @var string
	 */
	private $language;

	/**
	 * Description eg. Deutsch
	 * @var string
	 */
	private $description;

	/**
	 * Constructor
	 *
	 * @param \StdClass $obj
	 * @param string $description
	 */
	public function __construct( $obj, $description ) {
		if ( is_object( $obj ) ) {
			$this->obj      = $obj;
			$this->language = MslsBlogCollection::get_blog_language( $this->obj->userblog_id );
		}

		$this->description = (string) $description;
	}

	/**
	 * Get a member of the \StdClass-object by name
	 *
	 * The method return <em>null</em> if the requested member does not exists.
	 *
	 * @param string $key
	 *
	 * @return mixed|null
	 */
	final public function __get( $key ) {
		return isset( $this->obj->$key ) ? $this->obj->$key : null;
	}

	/**
	 * Get the description stored in this object
	 *
	 * The method returns the stored language if the description is empty.
	 * @return string
	 */
	public function get_description() {
		return empty( $this->description ) ? $this->get_language() : $this->description;
	}

	/**
	 * Gets the language stored in this object
	 *
	 * @param string $default
	 *
	 * @return string
	 */
	public function get_language( $default = 'en_US' ) {
		return empty( $this->language ) ? $default : $this->language;
	}

	/**
	 * Gets the alpha2-part of the language-code
	 *
	 * @return string
	 */
	public function get_alpha2() {
		$language = $this->get_language();

		return substr( $language, 0, 2 );
	}

	/**
	 * Sort objects helper
	 *
	 * @param string $a
	 * @param string $b
	 *
	 * @return int
	 */
	public static function _cmp( $a, $b ) {
		if ( $a == $b ) {
			return 0;
		}

		return ( $a < $b ? ( - 1 ) : 1 );
	}

	/**
	 * Sort objects by language
	 *
	 * @param MslsBlog $a
	 * @param MslsBlog $b
	 *
	 * @return int
	 */
	public static function language( MslsBlog $a, MslsBlog $b ) {
		return self::_cmp( $a->get_language(), $b->get_language() );
	}

	/**
	 * Sort objects by description
	 *
	 * @param MslsBlog $a
	 * @param MslsBlog $b
	 *
	 * @return int
	 */
	public static function description( MslsBlog $a, MslsBlog $b ) {
		return self::_cmp( $a->get_description(), $b->get_description() );
	}

}